import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateRoleRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  permissions: number[];

  @IsOptional()
  @IsInt()
  createdByUserId: number;
}
