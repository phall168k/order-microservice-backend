import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ type: [Number] })
    @IsOptional()
    roles?: number[];

    @ApiProperty()
    @IsOptional()
    isActive?: boolean;

    createdByUserId?: number;

}
