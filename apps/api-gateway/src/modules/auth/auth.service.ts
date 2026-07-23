import { AUTH_SERVICE, MESSAGE_PATTERN } from "@app/contracts/rmq.constants";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { LoginRequestDto } from "apps/auth-service/src/auth/dto/login-request.dto";
import { LoginResponseDto } from "apps/auth-service/src/auth/dto/login-response.dto";
import { UserEntity } from "apps/auth-service/src/user/entities/user.entity";
import { BaseRpcClientService } from "libs/common/microservices/base-rpc-client.service";

@Injectable()
export class AuthService extends BaseRpcClientService {
  constructor(
    @Inject(AUTH_SERVICE)
    authServiceClient: ClientProxy,
  ) {
    super(authServiceClient, "Auth service");
  }

  public login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.send(MESSAGE_PATTERN.AUTH_SERVICE.LOGIN, dto);
  }

  public findOneByUsername(username: string): Promise<UserEntity> {
    return this.send(
      MESSAGE_PATTERN.AUTH_SERVICE.USER.GET_BY_USERNAME,
      username,
    );
  }
}
