import { Controller } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryRequestDto } from "./dto/create-category-request.dto";
import { UpdateCategoryRequestDto } from "./dto/update-category-request.dto";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MESSAGE_PATTERN } from "@app/contracts/rmq.constants";
import { CategoryResponseDto } from "./dto/category-response.dto";
import { PaginatedResponse } from "libs/paginations/paginated-response.type";
import { CategoryEntity } from "./entities/category.entity";
import { type PaginateQuery } from "nestjs-paginate";
import { CategorySelectOptionResponseDto } from "./dto/category-select-option-response.dto";

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern(MESSAGE_PATTERN.PRODUCT_SERVICE.CATEGORY.CREATE)
  public create(
    @Payload() dto: CreateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.create(dto);
  }

  @MessagePattern(MESSAGE_PATTERN.PRODUCT_SERVICE.CATEGORY.GET_ALL)
  public findAll(
    @Payload() query: PaginateQuery,
  ): Promise<PaginatedResponse<CategoryEntity, CategoryResponseDto>> {
    return this.categoryService.list(query);
  }

  @MessagePattern(MESSAGE_PATTERN.PRODUCT_SERVICE.CATEGORY.SELECT_OPTIONS)
  public findAllForSelectOptions(): Promise<CategorySelectOptionResponseDto[]> {
    return this.categoryService.findAllForSelectOptions();
  }

  @MessagePattern(MESSAGE_PATTERN.PRODUCT_SERVICE.CATEGORY.GET_BY_ID)
  public findOne(@Payload() id: number): Promise<CategoryResponseDto> {
    return this.categoryService.findOne(+id);
  }

  @MessagePattern(MESSAGE_PATTERN.PRODUCT_SERVICE.CATEGORY.UPDATE)
  public update(
    @Payload() payload: UpdateCategoryRequestDto & { id: number },
  ): Promise<CategoryResponseDto> {
    const { id, ...dto } = payload;
    return this.categoryService.update(id, dto);
  }

  @MessagePattern(MESSAGE_PATTERN.PRODUCT_SERVICE.CATEGORY.DELETE)
  public remove(@Payload() id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}
