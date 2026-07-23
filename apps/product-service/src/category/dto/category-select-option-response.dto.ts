import { ApiProperty } from "@nestjs/swagger";

export class CategorySelectOptionResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    nameKh: string;
}