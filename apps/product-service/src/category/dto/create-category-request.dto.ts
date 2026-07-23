import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateCategoryRequestDto {
  @ApiProperty({ example: "Beverages", maxLength: 250 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  nameEn: string;

  @ApiProperty({ example: "ភេសជ្ជៈ", maxLength: 250 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  nameKh: string;

  @ApiHideProperty()
  @IsInt()
  @IsPositive()
  createdByUserId: number;
}
