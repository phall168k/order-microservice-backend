import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { RoleService } from "./role.service";
import { CreateRoleRequestDto } from "apps/auth-service/src/role/dto/create-role-request.dto";
import { RoleResponseDto } from "apps/auth-service/src/role/dto/role-response.dto";
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ApiPaginatedResponse } from "libs/paginations/api-paginated-response.decorator";
import { Paginate, type PaginateQuery } from "nestjs-paginate";
import { PaginatedResponse } from "libs/paginations/paginated-response.type";
import { RoleEntity } from "apps/auth-service/src/role/entities/role.entity";
import { RoleSelectOptionResponseDto } from "apps/auth-service/src/role/dto/role-select-option-response.dto";
import { UpdateRoleRequestDto } from "apps/auth-service/src/role/dto/update-role-request.dto";

@Controller({
  path: "admin/system/roles",
  version: "1",
})
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Post()
    @ApiOperation({
        summary: "Create a role",
    })
    @ApiCreatedResponse({ type: RoleResponseDto })
    public create(@Body() dto: CreateRoleRequestDto): Promise<RoleResponseDto> {
        return this.roleService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: "Get all roles" })
    @ApiPaginatedResponse(RoleResponseDto)
    public findAll(
        @Paginate() query: PaginateQuery,
    ): Promise<PaginatedResponse<RoleEntity, RoleResponseDto>> {
        return this.roleService.findAll(query);
    }

    @Get('select-options')
    @ApiOperation({ summary: "Get role select options" })
    @ApiOkResponse({ type: RoleResponseDto, isArray: true })
    public findAllForSelectOption(): Promise<RoleSelectOptionResponseDto[]> {
        return this.roleService.findAllForSelectOption();
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a role by id" })
    @ApiNotFoundResponse({ description: "Not found" })
    @ApiOkResponse({ type: RoleResponseDto })
    public findOne(@Param('id', ParseIntPipe) id: number): Promise<RoleResponseDto> {
        return this.roleService.findOne(id);
    }

    @Put(":id")
    @ApiOperation({ summary: "Update a role" })
    @ApiNotFoundResponse({ description: "Not found" })
    @ApiOkResponse({ type: RoleResponseDto })
    public update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRoleRequestDto,
        
    ): Promise<RoleResponseDto> {
        return this.roleService.update(id, dto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete a role" })
    @ApiNotFoundResponse({ description: "Not found" })
    @ApiOkResponse({ type: RoleResponseDto })
    public delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.roleService.delete(id);
    }
}
