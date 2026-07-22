import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginRequestDto {
    @ApiProperty({
        type: String,
        example: "Admin",
    })
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        type: String,
        example: "123"
    })
    @IsNotEmpty()
    password: string;
}