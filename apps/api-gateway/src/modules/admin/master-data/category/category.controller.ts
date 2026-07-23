import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { SWAGGER_TOKEN_NAME } from "apps/api-gateway/src/swagger/config";
import { CategoryService } from "./category.service";
import { Permissions } from "../../../auth/decorators/permissions.decorator";
import { CategoryResponseDto } from "apps/product-service/src/category/dto/category-response.dto";
import { CurrentUser } from "../../../auth/decorators/current-user.decorator";
import { UserEntity } from "apps/auth-service/src/user/entities/user.entity";
import { ApiPaginatedResponse } from "libs/paginations/api-paginated-response.decorator";
import { Paginate, type PaginateQuery } from "nestjs-paginate";
import { PaginatedResponse } from "libs/paginations/paginated-response.type";
import { CategoryEntity } from "apps/product-service/src/category/entities/category.entity";
import { CategorySelectOptionResponseDto } from "apps/product-service/src/category/dto/category-select-option-response.dto";
import { UpdateCategoryRequestDto } from "apps/product-service/src/category/dto/update-category-request.dto";
import { CreateCategoryBodyDto } from "./dto/create-category-body.dto";

@ApiTags("Category")
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: "admin/master-data/categories",
  version: "1",
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Permissions("category.create")
  @ApiOperation({ summary: "Create a category" })
  @ApiConflictResponse({ description: "Category is already created" })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Forbbiden" })
  public create(
    @Body() dto: CreateCategoryBodyDto,
    @CurrentUser() user: UserEntity,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.create({
      ...dto,
      createdByUserId: user.id,
    });
  }

  @Get()
  @Permissions("category.read")
  @ApiPaginatedResponse(CategoryResponseDto)
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<CategoryEntity, CategoryResponseDto>> {
    return this.categoryService.findAll(query);
  }

  @Get("select-options")
  @ApiOperation({ summary: "Category select options" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiOkResponse({ type: CategorySelectOptionResponseDto, isArray: true })
  public findAllForSelectOptions(): Promise<CategorySelectOptionResponseDto[]> {
    return this.categoryService.findAllForSelectOptions();
  }

  @Get(":id")
  @Permissions("category.read")
  @ApiOperation({ summary: "Get a category by id" })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiNotFoundResponse({ description: "Not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  public findOne(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.findOne(id);
  }

  @Put(":id")
  @Permissions("category.update")
  @ApiOperation({ summary: "Update a category by id" })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiNotFoundResponse({ description: "Not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.update(id, dto);
  }

  @Delete(":id")
  @Permissions("category.delete")
  @ApiOperation({ summary: "Delete a category by id" })
  @ApiNotFoundResponse({ description: "Not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  public delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.delete(id);
  }
}
