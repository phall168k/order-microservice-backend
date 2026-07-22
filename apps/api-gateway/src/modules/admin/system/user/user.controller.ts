import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateUserRequestDto } from 'apps/auth-service/src/user/dto/create-user-request.dto';
import { UserResponseDto } from 'apps/auth-service/src/user/dto/user-response.dto';
import { UserService } from './user.service';
import { ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'libs/paginations/api-paginated-response.decorator';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from 'libs/paginations/paginated-response.type';
import { UserEntity } from 'apps/auth-service/src/user/entities/user.entity';
import { UserSelectOptionResponseDto } from 'apps/auth-service/src/user/dto/user-select-option-response.dto';
import { UpdateUserRequestDto } from 'apps/auth-service/src/user/dto/update-user-request.dto';

@Controller({
    path: 'admin/system/users',
    version: '1',
})
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiOperation({ summary: "Create a user" })
    @ApiCreatedResponse({ type: UserResponseDto })
    @ApiConflictResponse({ description: "User conflict" })
    public create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
        return this.userService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: "Get all users" })
    @ApiPaginatedResponse(UserResponseDto)
    public findAll(@Paginate() query: PaginateQuery): Promise<PaginatedResponse<UserEntity, UserResponseDto>> {
        return this.userService.findAll(query);
    }

    @Get("select-options")
    @ApiOperation({ summary: "Get user select options" })
    @ApiOkResponse({ type: UserSelectOptionResponseDto, isArray: true })
    public findAllForSelectOption(): Promise<UserSelectOptionResponseDto[]> {
        return this.userService.findAllForSelectOptoins();
    }

    @Get(":id")
    @ApiOperation({ summary: "Get a user by id" })
    @ApiNotFoundResponse({ description: "Not found" })
    @ApiOkResponse({ type: UserResponseDto })
    public findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
        return this.userService.findOne(id);
    }

    @Put(":id")
    @ApiOperation({ summary: "Update a user" })
    @ApiNotFoundResponse({ description: "Not found" })
    @ApiOkResponse({ type: UserResponseDto })
    public update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserRequestDto,
        
    ): Promise<UserResponseDto> {
        return this.userService.update(id, dto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Delete a user" })
    @ApiNotFoundResponse({ description: "Not found" })
    @ApiOkResponse({ type: UserResponseDto })
    public delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.userService.delete(id);
    }




}
