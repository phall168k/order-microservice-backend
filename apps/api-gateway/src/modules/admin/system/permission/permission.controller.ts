import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CreatePermissionRequestDto } from "./dto/create-permission-request.dto";
import { PermissionResponseDto } from "./dto/permission-response.dto";
import { UpdatePermissionRequestDto } from "./dto/update-permission-request.dto";
import { PermissionService } from "./permission.service";
import { ApiPaginatedResponse } from "libs/paginations/api-paginated-response.decorator";
import { Paginate, type PaginateQuery } from "nestjs-paginate";
import { PaginatedResponse } from "libs/paginations/paginated-response.type";
import { PermissionEntity } from "apps/auth-service/src/permission/entities/permission.entity";
import { SWAGGER_TOKEN_NAME } from "../../../../swagger/config";
import { Permissions } from "../../../auth/decorators/permissions.decorator";

@ApiTags("Admin - Permissions")
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: "admin/system/permissions",
  version: "1",
})
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Permissions('permission.create')
  @ApiOperation({ summary: "Create a permission" })
  @ApiCreatedResponse({ type: PermissionResponseDto })
  create(@Body() dto: CreatePermissionRequestDto) {
    return this.permissionService.create(dto);
  }

  @Get()
  @Permissions('permission.read')
  @ApiOperation({ summary: "Get all permissions" })
  @ApiPaginatedResponse(PermissionResponseDto)
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<PermissionEntity, PermissionResponseDto>> {
    return this.permissionService.findAll(query);
  }

  @Get("select-options")
  @ApiOperation({ summary: "Get permission select options" })
  @ApiOkResponse({ type: PermissionResponseDto, isArray: true })
  selectOptions() {
    return this.permissionService.selectOptions();
  }

  @Get(":id")
  @Permissions('permission.read')
  @ApiOperation({ summary: "Get a permission by id" })
  @ApiOkResponse({ type: PermissionResponseDto })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.permissionService.findOne(id);
  }

  @Put(":id")
  @Permissions('permission.update')
  @ApiOperation({ summary: "Update a permission" })
  @ApiOkResponse({ type: PermissionResponseDto })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePermissionRequestDto,
  ) {
    return this.permissionService.update(id, dto);
  }

  @Delete(":id")
  @Permissions('permission.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a permission" })
  @ApiNoContentResponse()
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.permissionService.remove(id);
  }
}
