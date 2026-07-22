import {
  GatewayTimeoutException,
  HttpException,
  InternalServerErrorException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, timeout, TimeoutError } from "rxjs";

interface RpcError {
  message?: string | string[];
  code?: string;
  statusCode?: number;
}

export abstract class BaseRpcClientService {
  protected constructor(
    protected readonly client: ClientProxy,
    private readonly serviceName: string,
  ) {}

  protected async send<TResponse, TPayload>(
    pattern: string,
    payload: TPayload,
    timeoutMs = 5000,
  ): Promise<TResponse> {
    try {
      return await firstValueFrom(
        this.client
          .send<TResponse, TPayload>(pattern, payload)
          .pipe(timeout(timeoutMs)),
      );
    } catch (error: unknown) {
      if (error instanceof TimeoutError) {
        throw new GatewayTimeoutException(
          `${this.serviceName} did not respond`,
        );
      }

      if (error instanceof HttpException) {
        throw error;
      }

      const rpcError = error as RpcError;

      if (rpcError?.message) {
        throw new HttpException(
          {
            message: rpcError.message,
            code: rpcError.code,
          },
          rpcError.statusCode ?? this.codeToStatus(rpcError.code),
        );
      }

      throw new InternalServerErrorException(
        `${this.serviceName} request failed`,
      );
    }
  }

  private codeToStatus(code?: string): number {
    switch (code) {
      case "BAD_REQUEST":
        return 400;
      case "UNAUTHORIZED":
        return 401;
      case "FORBIDDEN":
        return 403;
      case "NOT_FOUND":
        return 404;
      case "CONFLICT":
        return 409;
      case "VALIDATION_ERROR":
      case "UNPROCESSABLE_ENTITY":
        return 422;
      default:
        return 500;
    }
  }
}
