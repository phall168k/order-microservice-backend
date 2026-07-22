import { ApiProperty } from "@nestjs/swagger";
import { UserPayloadResponseDto } from "./user-payload-response.dto";
import { TokenResponseDto } from "./token-response.dto";

export class LoginResponseDto {
    @ApiProperty()
    user: UserPayloadResponseDto;
    
    @ApiProperty()
    token: TokenResponseDto;
}