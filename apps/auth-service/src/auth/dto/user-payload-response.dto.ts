import { ApiProperty } from "@nestjs/swagger";

export class UserPayloadResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    isAdmin: boolean;

    @ApiProperty()
    roles: string[];

    @ApiProperty()
    permissions: string[];

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;

}