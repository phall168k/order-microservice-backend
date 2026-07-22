import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreatePermissionRequestDto {
  @ApiProperty({ example: "user.create" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
