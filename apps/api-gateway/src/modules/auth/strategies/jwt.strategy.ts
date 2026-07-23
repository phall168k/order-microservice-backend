import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";
import { UserPayloadResponseDto } from "apps/auth-service/src/auth/dto/user-payload-response.dto";
import { UserMapper } from "apps/auth-service/src/user/user.mapper";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
    });
  }

  async validate(
    payload: UserPayloadResponseDto,
  ): Promise<UserPayloadResponseDto> {
    const user = await this.authService.findOneByUsername(payload.username);
    if (!user || !user.isActive) {
      throw new UnauthorizedException("Unauthorized");
    }

    const userDto = await UserMapper.toDtoWithRelationship(user);
    const authenticatedUser: UserPayloadResponseDto = {
      id: userDto.id,
      username: userDto.username,
      email: userDto.email,
      isAdmin: userDto.isAdmin,
      isActive: userDto.isActive,
      roles: payload.roles ?? [],
      permissions: payload.permissions ?? [],
      createdAt: userDto.createdAt,
      updatedAt: userDto.updatedAt,
      deletedAt: userDto.deletedAt,
    };

    return authenticatedUser;
  }
}
