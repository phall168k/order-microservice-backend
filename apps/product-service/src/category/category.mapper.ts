import { UserMapper } from "apps/auth-service/src/user/user.mapper";
import { CategoryResponseDto } from "./dto/category-response.dto";
import { CategoryEntity } from "./entities/category.entity";
import { CreateCategoryRequestDto } from "./dto/create-category-request.dto";
import { UpdateCategoryRequestDto } from "./dto/update-category-request.dto";

export class CategoryMapper {
    public static async toDto (entity: CategoryEntity): Promise<CategoryResponseDto> {
        const dto = new CategoryResponseDto();
        dto.id = entity.id;
        dto.nameEn = entity.nameEn;
        dto.nameKh = entity.nameKh;
        dto.createdByUserId = entity.createdByUserId;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;
        
        return dto;
    }

    public static toCreateEntity(dto: CreateCategoryRequestDto): CategoryEntity {
        const entity = new CategoryEntity();
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        entity.createdByUserId = dto.createdByUserId;
        
        return entity;
    }

    public static toUpdateEntity(entity: CategoryEntity, dto: UpdateCategoryRequestDto): CategoryEntity {
        entity.nameEn = dto.nameEn;
        entity.nameKh = dto.nameKh;
        
        return entity;
    }
}