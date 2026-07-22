import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MESSAGE_PATTERN } from "@app/contracts/rmq.constants";
import { RoleService } from "./role.service";
import { CreateRoleRequestDto } from "./dto/create-role-request.dto";
import { UpdateRoleRequestDto } from "./dto/update-role-request.dto";
import { RoleResponseDto } from "./dto/role-response.dto";
import { RoleSelectOptionResponseDto } from "./dto/role-select-option-response.dto";
import { PaginatedResponse } from "libs/paginations/paginated-response.type";
import { type PaginateQuery } from "nestjs-paginate";
import { RoleEntity } from "./entities/role.entity";

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.ROLE.CREATE)
  create(@Payload() dto: CreateRoleRequestDto): Promise<RoleResponseDto> {
    return this.roleService.create(dto);
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.ROLE.GET_ALL)
  findAll(@Payload() query: PaginateQuery): Promise<PaginatedResponse<RoleEntity, RoleResponseDto>> {
    return this.roleService.list(query);
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.ROLE.SELECT_OPTIONS)
  selectOptions(): Promise<RoleSelectOptionResponseDto[]> {
    return this.roleService.findAllForSelection();
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.ROLE.GET_BY_ID)
  findOne(@Payload() id: number): Promise<RoleResponseDto> {
    return this.roleService.findOne(id);
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.ROLE.UPDATE)
  update(@Payload() payload: UpdateRoleRequestDto & { id: number }): Promise<RoleResponseDto> {
    const { id, ...dto } = payload;
    return this.roleService.update(id, dto);
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.ROLE.DELETE)
  remove(@Payload() id: number): Promise<void> {
    return this.roleService.remove(id);
  }
}
