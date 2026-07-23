import { MESSAGE_PATTERN, PRODUCT_SERVICE } from '@app/contracts/rmq.constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CategoryResponseDto } from 'apps/product-service/src/category/dto/category-response.dto';
import { CategorySelectOptionResponseDto } from 'apps/product-service/src/category/dto/category-select-option-response.dto';
import { CreateCategoryRequestDto } from 'apps/product-service/src/category/dto/create-category-request.dto';
import { UpdateCategoryRequestDto } from 'apps/product-service/src/category/dto/update-category-request.dto';
import { CategoryEntity } from 'apps/product-service/src/category/entities/category.entity';
import { BaseRpcClientService } from 'libs/common/microservices/base-rpc-client.service';
import { PaginatedResponse } from 'libs/paginations/paginated-response.type';
import { PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class CategoryService extends BaseRpcClientService {
    constructor(
        @Inject(PRODUCT_SERVICE)
        productServiceClient: ClientProxy,
    ) {
        super(productServiceClient, "Product service");
    }

    public create(dto: CreateCategoryRequestDto): Promise<CategoryResponseDto> {
        return this.send(
            MESSAGE_PATTERN.PRODUCT_SERVICE.CATEGORY.CREATE,
            dto,
        );
    }

    public findAll(query: PaginateQuery): Promise<PaginatedResponse<CategoryEntity, CategoryResponseDto>> {
        return this.send(
            MESSAGE_PATTERN.PRODUCT_SERVICE.CATEGORY.GET_ALL,
            query,
        );
    }

    public findAllForSelectOptions(): Promise<CategorySelectOptionResponseDto[]> {
        return this.send(
            MESSAGE_PATTERN.PRODUCT_SERVICE.CATEGORY.SELECT_OPTIONS,
            {},
        );
    }

    public findOne(id: number): Promise<CategoryResponseDto> {
        return this.send(
            MESSAGE_PATTERN.PRODUCT_SERVICE.CATEGORY.GET_BY_ID,
            id,
        );
    }

    public update(id: number, dto: UpdateCategoryRequestDto): Promise<CategoryResponseDto> {
        return this.send(
            MESSAGE_PATTERN.PRODUCT_SERVICE.CATEGORY.UPDATE,
            {
                ...dto,
                id: id,
            }
        );
    }

    public delete(id: number): Promise<void> {
        return this.send(
            MESSAGE_PATTERN.PRODUCT_SERVICE.CATEGORY.DELETE,
            id,
        );
    }
}
