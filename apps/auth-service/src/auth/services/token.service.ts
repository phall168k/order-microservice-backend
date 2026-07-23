import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { TokenResponseDto } from "apps/auth-service/src/auth/dto/token-response.dto";
import { UserPayloadResponseDto } from "../dto/user-payload-response.dto";

@Injectable()
export class TokenService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  public generateAuthToken(payload: UserPayloadResponseDto): TokenResponseDto {
    const accessTokenExpiresIn = this.configService.get<string | number>(
      "JWT_EXPIRES_IN",
      3600,
    );
    const tokenType = this.configService.get<string>("TOKEN_TYPE", "Bearer");
    const accessToken = this.generateToken(payload);
    return {
      accessToken,
      expiresIn: accessTokenExpiresIn,
      tokenType,
    };
  }

  private generateToken(payload: UserPayloadResponseDto): string {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
