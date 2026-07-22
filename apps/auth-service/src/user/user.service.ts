import { Injectable } from "@nestjs/common";
import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { UpdateUserRequestDto } from "./dto/update-user-request.dto";
import { BasePaginationCrudService } from "libs/services/base-pagination-crud.service";
import { UserEntity } from "./entities/user.entity";
import { UserResponseDto } from "./dto/user-response.dto";
import { UserMapper } from "./user.mapper";
import { PasswordHash } from "libs/utils/password-hash.util";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class UserService extends BasePaginationCrudService<
  UserEntity,
  UserResponseDto
> {
  protected SORTABLE_COLUMNS = ["id", "username", "email", "createdAt"];
  protected FILTER_COLUMNS = ["username", "email"];
  protected SEARCHABLE_COLUMNS = ["username", "email", "roles.name"];
  protected RELATIONSIP_FIELDS = ["roles"];

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super();
  }

  protected get repository(): Repository<UserEntity> {
    return this.userRepository;
  }

  protected getMapperReponseEntityField(
    entities: UserEntity,
  ): Promise<UserResponseDto> {
    return UserMapper.toDtoWithRelationship(entities);
  }

  public async create(dto: CreateUserRequestDto): Promise<UserResponseDto> {
    try {
      let entity = UserMapper.toCreateEntity({
        ...dto,
        password: await PasswordHash.hash(dto.password),
        roles: [],
      });
      entity = await this.userRepository.save(entity);
      if (dto.roles?.length) {
        await this.userRepository
          .createQueryBuilder()
          .relation(UserEntity, "roles")
          .of(entity.id) // or entity
          .add(dto.roles);
      }
      return UserMapper.toDto(entity);
    } catch (error) {
      throw error;
    }
  }

  public async findAllForSelection(): Promise<
    { id: number; username: string }[]
  > {
    try {
      const entity = await this.userRepository.find({
        select: {
          id: true,
          username: true,
        },
        where: {
          isActive: true,
        },
      });
      return entity;
    } catch (error) {
      throw error;
    }
  }

  public async findOne(id: number): Promise<UserResponseDto> {
    try {
      const entity = await this.userRepository.findOne({
        where: {
          id,
        },
        relations: {
          roles: true,
        },
      });
      if (!entity) {
        throw new RpcException({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return UserMapper.toDtoWithRelationship(entity);
    } catch (error) {
      throw error;
    }
  }

  public async findOneByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: [{ username: username }, { email: username }],
      relations: {
        roles: {
          permissions: true,
        },
      },
    });
  }

  public async update(
    id: number,
    dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    try {
      const entity = await this.userRepository.findOne({
        where: {
          id,
        },
        relations: {
          roles: true,
        },
      });
      if (!entity) {
        throw new RpcException({
          code: "NOT_FOUNT",
          message: "User not found",
        });
      }

      const oldRoleIds = ((await entity.roles) ?? []).map((role) => role.id);

      const updatedEntity = UserMapper.toUpdateEntity(entity, dto);
      await this.userRepository.save(updatedEntity);

      if (dto.roles) {
        const newRoleIds = dto.roles;
        const roleIdsToAdd = newRoleIds.filter(
          (roleId) => !oldRoleIds.includes(roleId),
        );
        const roleIdsToRemove = oldRoleIds.filter(
          (roleId) => !newRoleIds.includes(roleId),
        );

        if (roleIdsToAdd.length || roleIdsToRemove.length) {
          await this.userRepository
            .createQueryBuilder()
            .relation(UserEntity, "roles")
            .of(id)
            .addAndRemove(roleIdsToAdd, roleIdsToRemove);
        }
      }
      return this.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  public async remove(id: number): Promise<void> {
    try {
      const entity = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new RpcException({
          code: "NOT_FOUNT",
          message: "User not found",
        });
      }

      await this.userRepository.softRemove(entity);
    } catch (error) {
      throw error;
    }
  }
}
