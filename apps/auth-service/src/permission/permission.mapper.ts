import { CreatePermissionRequestDto } from "./dto/create-permission-request.dto";
import { PermissionResponseDto } from "./dto/permission-response.dto";
import { UpdatePermissionRequestDto } from "./dto/update-permission-request.dto";
import { PermissionEntity } from "./entities/permission.entity";

export class PermissionMapper {
  static toEntity(dto: CreatePermissionRequestDto): PermissionEntity {
    return new PermissionEntity({ name: dto.name });
  }

  static applyUpdate(
    entity: PermissionEntity,
    dto: UpdatePermissionRequestDto,
  ): PermissionEntity {
    if (dto.name !== undefined) entity.name = dto.name;
    return entity;
  }

  static async toDto(entity: PermissionEntity): Promise<PermissionResponseDto> {
    const dto = new PermissionResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.deletedAt = entity.deletedAt;
    return dto;
  }

}
