import { Injectable } from '@nestjs/common';
import { CreateCategoryRequestDto } from './dto/create-category-request.dto';
import { UpdateCategoryRequestDto } from './dto/update-category-request.dto';
import { BasePaginationCrudService } from 'libs/services/base-pagination-crud.service';
import { CategoryEntity } from './entities/category.entity';
import { CategoryResponseDto } from './dto/category-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryMapper } from './category.mapper';
import { CategorySelectOptionResponseDto } from './dto/category-select-option-response.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CategoryService extends BasePaginationCrudService<
  CategoryEntity,
  CategoryResponseDto
>{

  protected SORTABLE_COLUMNS = ["id", "nameEn", "nameKh"];
  protected FILTER_COLUMNS = ["nameEn", "nameKh"];
  protected SEARCHABLE_COLUMNS = [
    "nameEn",
    "nameKh",
  ];
  protected RELATIONSIP_FIELDS = [];

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
    super();
  }

  protected get repository(): Repository<CategoryEntity> {
    return this.categoryRepository;
  }

  protected getMapperReponseEntityField(
    entity: CategoryEntity,
  ): Promise<CategoryResponseDto> {
    return CategoryMapper.toDto(entity);
  }

  public async create(dto: CreateCategoryRequestDto): Promise<CategoryResponseDto> {
    try {
      let entity = CategoryMapper.toCreateEntity(dto);
      entity = await this.categoryRepository.save(entity);
      return CategoryMapper.toDto(entity);
    } catch (error) {
      throw error;
    }
  }

  public async findAllForSelectOptions(): Promise<CategorySelectOptionResponseDto[]> {
    try {
      const entities = await this.categoryRepository.find({
        select: {
          id: true,
          nameEn: true,
          nameKh: true,
        },
      });
      return entities;
    } catch (error) {
      throw error;
    }
  }

  public async findOne(id: number): Promise<CategoryResponseDto> {
    try {
      const entity = await this.categoryRepository.findOne({
        where: { id },
      });
      if (!entity) {
        throw new RpcException({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }
      return CategoryMapper.toDto(entity);
    } catch (error) {
      throw error;
    }
  }

  public async update(id: number, dto: UpdateCategoryRequestDto): Promise<CategoryResponseDto> {
    try {
      let entity = await this.categoryRepository.findOneBy({ id });
      if (!entity) {
        throw new RpcException({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }
      entity = CategoryMapper.toUpdateEntity(entity, dto);
      entity = await this.categoryRepository.save(entity);
      return CategoryMapper.toDto(entity);
    } catch (error) {
      throw error;
    }
  }

  public async remove(id: number): Promise<void> {
    try {
      let entity = await this.categoryRepository.findOneBy({ id });
      if (!entity) {
        throw new RpcException({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }
      await this.categoryRepository.softDelete(id);
    } catch (error) {
      throw error;
    }
  }
}
