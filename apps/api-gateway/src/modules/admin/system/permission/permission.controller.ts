import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
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

@ApiTags("Admin - Permissions")
@Controller({
  path: "admin/system/permissions",
  version: "1",
})
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ summary: "Create a permission" })
  @ApiCreatedResponse({ type: PermissionResponseDto })
  create(@Body() dto: CreatePermissionRequestDto) {
    return this.permissionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Get all permissions" })
  @ApiPaginatedResponse(PermissionResponseDto)
  public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<PermissionEntity, PermissionResponseDto>> {
    return this.permissionService.findAll(query);
  }

  @Get("select-options")
  @ApiOperation({ summary: "Get permission select options" })
  @ApiOkResponse({ type: PermissionResponseDto, isArray: true })
  selectOptions() {
    return this.permissionService.selectOptions();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a permission by id" })
  @ApiOkResponse({ type: PermissionResponseDto })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.permissionService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a permission" })
  @ApiOkResponse({ type: PermissionResponseDto })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePermissionRequestDto,
  ) {
    return this.permissionService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a permission" })
  @ApiNoContentResponse()
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.permissionService.remove(id);
  }
}
