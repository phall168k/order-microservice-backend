import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "../../user/dto/user-response.dto";
import { PermissionResponseDto } from "../../permission/dto/permission-response.dto";

export class RoleResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdByUserId: number;

  @ApiProperty()
  createdByUser: UserResponseDto;

  @ApiProperty({ type: [PermissionResponseDto] })
  permissions: PermissionResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
