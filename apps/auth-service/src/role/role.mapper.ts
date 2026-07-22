import { PermissionMapper } from "../permission/permission.mapper";
import { PermissionEntity } from "../permission/entities/permission.entity";
import { CreateRoleRequestDto } from "./dto/create-role-request.dto";
import { RoleResponseDto } from "./dto/role-response.dto";
import { RoleEntity } from "./entities/role.entity";
import { UserMapper } from "../user/user.mapper";
import { UpdateRoleRequestDto } from "./dto/update-role-request.dto";
import { RoleSelectOptionResponseDto } from "./dto/role-select-option-response.dto";

export class RoleMapper {

  public static async toDto(entity: RoleEntity): Promise<RoleResponseDto> {
    const dto = new RoleResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.createdByUserId = entity.createdByUserId;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.deletedAt = entity.deletedAt;

    if (entity.createdByUser) { 
        dto.createdByUser = await UserMapper.toDto(entity.createdByUser);
    }

    if (entity.permissions && (await entity.permissions).length > 0) {
      dto.permissions = await Promise.all(
        (await entity.permissions).map((item) => PermissionMapper.toDto(item)),
      );
    }

    return dto;
  }

  public static toDtoList(entities: RoleEntity[]): Promise<RoleResponseDto[]> {
    return Promise.all(entities.map((item) => this.toDto(item)));
  }

  public static toSelectOptionDto(
    entity: RoleEntity,
  ): RoleSelectOptionResponseDto {
    const dto = new RoleSelectOptionResponseDto();

    dto.id = entity.id;
    dto.name = entity.name;

    return dto;
  }

  public static toCreateEntity(dto: CreateRoleRequestDto): RoleEntity {
    const entity = new RoleEntity();
    entity.name = dto.name;

    return entity;
  }

  public static toUpdateEntity(
    entity: RoleEntity,
    dto: UpdateRoleRequestDto,
  ): RoleEntity {
    entity.name = dto.name ?? entity.name;

    return entity;
  }

}
