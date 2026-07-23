import { Injectable } from "@nestjs/common";
import { UserService } from "../../user/user.service";
import { LoginResponseDto } from "../dto/login-response.dto";
import { LoginRequestDto } from "../dto/login-request.dto";
import { RpcException } from "@nestjs/microservices";
import { PasswordHash } from "libs/utils/password-hash.util";
import { TokenService } from "./token.service";
import { UserMapper } from "../../user/user.mapper";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  public async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userService.findOneByUsername(dto.username);
    if (!user) {
      throw new RpcException({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    const isMatched = await PasswordHash.verify(dto.password, user.password);
    if (!isMatched) {
      throw new RpcException({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    return this.payloadGenerate(user.username);
  }

  private async payloadGenerate(username: string): Promise<LoginResponseDto> {
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new RpcException({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    const roles = await user.roles;
    const allPermissions = roles.flatMap((role) =>
      role.permissions.map((permission) => permission.name),
    );
    const uniquePermissions = Array.from(new Set(allPermissions));
    const userMapped = UserMapper.toDto(user);
    const userRoles = roles.map((item) => item.name);

    const authenticatedUser = {
      ...userMapped,
      roles: userRoles,
      permissions: uniquePermissions,
    };
    const token = this.tokenService.generateAuthToken(authenticatedUser);
    return {
      user: authenticatedUser,
      token,
    };
  }
}
