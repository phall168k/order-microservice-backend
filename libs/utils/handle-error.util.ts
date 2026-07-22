import { HttpException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

type ErrorResponse = {
  code: string;
  message: string | string[];
};

export function handleError(error: unknown): never {
  if (error instanceof RpcException) {
    throw error;
  }

  if (error instanceof HttpException) {
    const response = error.getResponse();
    const message =
      typeof response === "string"
        ? response
        : ((response as { message?: string | string[] }).message ??
          error.message);

    throw new RpcException({
      code: statusToCode(error.getStatus()),
      message,
    } satisfies ErrorResponse);
  }

  throw new RpcException({
    code: "INTERNAL_SERVER_ERROR",
    message: error instanceof Error ? error.message : "Unexpected error",
  } satisfies ErrorResponse);
}

function statusToCode(status: number): string {
  switch (status) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    case 422:
      return "UNPROCESSABLE_ENTITY";
    default:
      return status >= 500 ? "INTERNAL_SERVER_ERROR" : `HTTP_${status}`;
  }
}
