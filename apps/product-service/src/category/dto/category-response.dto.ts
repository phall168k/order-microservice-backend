import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nameEn: string;

    @ApiProperty()
    nameKh: string;

    @ApiProperty()
    createdByUserId: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}