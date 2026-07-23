import { ApiProperty } from "@nestjs/swagger";

export class TokenResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  tokenType: string;

  @ApiProperty()
  expiresIn: string | number;
}
