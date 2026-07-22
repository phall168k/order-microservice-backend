import {
  GatewayTimeoutException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AUTH_SERVICE, MESSAGE_PATTERN } from "@app/contracts/rmq.constants";
import { TimeoutError, firstValueFrom, timeout } from "rxjs";
import { CreatePermissionRequestDto } from "./dto/create-permission-request.dto";
import { PermissionResponseDto } from "./dto/permission-response.dto";
import { UpdatePermissionRequestDto } from "./dto/update-permission-request.dto";
import { PaginateQuery } from "nestjs-paginate";
import { PaginatedResponse } from "libs/paginations/paginated-response.type";
import { PermissionEntity } from "apps/auth-service/src/permission/entities/permission.entity";

type RpcError = {
  statusCode?: number;
  code?: string;
  message?: string | string[];
};

@Injectable()
export class PermissionService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authServiceClient: ClientProxy,
  ) {}

  create(dto: CreatePermissionRequestDto): Promise<PermissionResponseDto> {
    return this.send(MESSAGE_PATTERN.AUTH_SERVICE.PERMISSION.CREATE, dto);
  }

  public findAll(query: PaginateQuery): Promise<PaginatedResponse<PermissionEntity, PermissionResponseDto>> {
    return this.send(MESSAGE_PATTERN.AUTH_SERVICE.PERMISSION.GET_ALL, query);
  }

  selectOptions(): Promise<PermissionResponseDto[]> {
    return this.send(
      MESSAGE_PATTERN.AUTH_SERVICE.PERMISSION.SELECT_OPTIONS,
      {},
    );
  }

  findOne(id: number): Promise<PermissionResponseDto> {
    return this.send(MESSAGE_PATTERN.AUTH_SERVICE.PERMISSION.GET_BY_ID, id);
  }

  update(
    id: number,
    dto: UpdatePermissionRequestDto,
  ): Promise<PermissionResponseDto> {
    return this.send(MESSAGE_PATTERN.AUTH_SERVICE.PERMISSION.UPDATE, {
      id,
      ...dto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.send<{ success: true }, number>(
      MESSAGE_PATTERN.AUTH_SERVICE.PERMISSION.DELETE,
      id,
    );
  }

  private async send<TResponse, TPayload>(
    pattern: string,
    payload: TPayload,
  ): Promise<TResponse> {
    try {
      return await firstValueFrom(
        this.authServiceClient
          .send<TResponse, TPayload>(pattern, payload)
          .pipe(timeout(5000)),
      );
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new GatewayTimeoutException("Auth service did not respond");
      }
      if (error instanceof HttpException) throw error;

      const rpcError = error as RpcError;
      if (rpcError?.message) {
        throw new HttpException(
          { message: rpcError.message, code: rpcError.code },
          rpcError.statusCode ?? this.codeToStatus(rpcError.code),
        );
      }
      throw new InternalServerErrorException("Auth service request failed");
    }
  }

  private codeToStatus(code?: string): number {
    const statuses: Record<string, number> = {
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      CONFLICT: 409,
      UNPROCESSABLE_ENTITY: 422,
    };
    return statuses[code ?? ""] ?? 500;
  }
}
