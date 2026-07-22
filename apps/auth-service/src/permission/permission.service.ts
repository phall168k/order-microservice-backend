import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RpcException } from "@nestjs/microservices";
import { QueryFailedError, Repository } from "typeorm";
import { CreatePermissionRequestDto } from "./dto/create-permission-request.dto";
import { UpdatePermissionRequestDto } from "./dto/update-permission-request.dto";
import { PermissionEntity } from "./entities/permission.entity";
import { PermissionMapper } from "./permission.mapper";
import { PermissionResponseDto } from "./dto/permission-response.dto";
import { BasePaginationCrudService } from "libs/services/base-pagination-crud.service";

@Injectable()
export class PermissionService extends BasePaginationCrudService<
  PermissionEntity,
  PermissionResponseDto
>{

  protected SORTABLE_COLUMNS = ['id', 'name'];
  protected FILTER_COLUMNS = ['name'];
  protected SEARCHABLE_COLUMNS = ['name'];

  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {
    super();
  }

  protected get repository(): Repository<PermissionEntity> {
    return this.permissionRepository;
  }

  protected getMapperReponseEntityField(
    entity: PermissionEntity,
  ): Promise<PermissionResponseDto> {
    return PermissionMapper.toDto(entity);
  }

  async create(
    dto: CreatePermissionRequestDto,
  ): Promise<PermissionResponseDto> {
    const permission = PermissionMapper.toEntity(dto);

    try {
      const savedPermission = await this.permissionRepository.save(permission);
      return PermissionMapper.toDto(savedPermission);
    } catch (error) {
      this.handleDatabaseError(error, dto.name);
    }
  }

  async findAllForSelectOption() {
    return await this.permissionRepository.find({
      select: {
        id: true,
        name: true,
      }
    });
  }

  async findOne(id: number): Promise<PermissionResponseDto> {
    return PermissionMapper.toDto(await this.findEntity(id));
  }

  private async findEntity(id: number): Promise<PermissionEntity> {
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new RpcException({
        statusCode: 404,
        message: `Permission with id ${id} was not found`,
      });
    }
    return permission;
  }

  async update(
    id: number,
    dto: UpdatePermissionRequestDto,
  ): Promise<PermissionResponseDto> {
    const permission = await this.findEntity(id);
    PermissionMapper.applyUpdate(permission, dto);

    try {
      const savedPermission = await this.permissionRepository.save(permission);
      return PermissionMapper.toDto(savedPermission);
    } catch (error) {
      this.handleDatabaseError(error, dto.name);
    }
  }

  async remove(id: number): Promise<void> {
    const permission = await this.findEntity(id);
    await this.permissionRepository.remove(permission);
  }

  private handleDatabaseError(error: unknown, name?: string): never {
    if (
      error instanceof QueryFailedError &&
      (error as { code?: string }).code === "23505"
    ) {
      throw new RpcException({
        statusCode: 409,
        message: `Permission${name ? ` '${name}'` : ""} already exists`,
      });
    }
    throw error;
  }
}
