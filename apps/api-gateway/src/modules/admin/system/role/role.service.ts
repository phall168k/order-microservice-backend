import { AUTH_SERVICE, MESSAGE_PATTERN } from "@app/contracts/rmq.constants";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateRoleRequestDto } from "apps/auth-service/src/role/dto/create-role-request.dto";
import { RoleResponseDto } from "apps/auth-service/src/role/dto/role-response.dto";
import { RoleSelectOptionResponseDto } from "apps/auth-service/src/role/dto/role-select-option-response.dto";
import { UpdateRoleRequestDto } from "apps/auth-service/src/role/dto/update-role-request.dto";
import { RoleEntity } from "apps/auth-service/src/role/entities/role.entity";
import { BaseRpcClientService } from "libs/common/microservices/base-rpc-client.service";
import { PaginatedResponse } from "libs/paginations/paginated-response.type";
import { PaginateQuery } from "nestjs-paginate";

@Injectable()
export class RoleService extends BaseRpcClientService {
  constructor(
    @Inject(AUTH_SERVICE)
    authServiceClient: ClientProxy,
  ) {
    super(authServiceClient, "Auth service");
  }

  public create(dto: CreateRoleRequestDto): Promise<RoleResponseDto> {
    return this.send<RoleResponseDto, CreateRoleRequestDto>(
      MESSAGE_PATTERN.AUTH_SERVICE.ROLE.CREATE,
      dto,
    );
  }

  public findAll(
    query: PaginateQuery,
  ): Promise<PaginatedResponse<RoleEntity, RoleResponseDto>> {
    return this.send(MESSAGE_PATTERN.AUTH_SERVICE.ROLE.GET_ALL, query);
  }
  
  public findAllForSelectOption(): Promise<RoleSelectOptionResponseDto[]> {
    return this.send(MESSAGE_PATTERN.AUTH_SERVICE.ROLE.SELECT_OPTIONS, {});
  }

  public findOne(id: number): Promise<RoleResponseDto> {
    return this.send(MESSAGE_PATTERN.AUTH_SERVICE.ROLE.GET_BY_ID, id);
  }

  public update(id: number, dto: UpdateRoleRequestDto): Promise<RoleResponseDto> {
    return this.send(MESSAGE_PATTERN.AUTH_SERVICE.ROLE.UPDATE, {
        ...dto,
        id: id,
    });
  }

  public delete(id: number): Promise<void> { 
    return this.send(MESSAGE_PATTERN.AUTH_SERVICE.ROLE.DELETE, id);
  }

}
