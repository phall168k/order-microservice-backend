import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MESSAGE_PATTERN } from "@app/contracts/rmq.constants";
import { PermissionService } from "./permission.service";
import { CreatePermissionRequestDto } from "./dto/create-permission-request.dto";
import { UpdatePermissionRequestDto } from "./dto/update-permission-request.dto";
import { type PaginateQuery } from "nestjs-paginate";

@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.PERMISSION.CREATE)
  create(@Payload() dto: CreatePermissionRequestDto) {
    return this.permissionService.create(dto);
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.PERMISSION.GET_ALL)
  findAll(@Payload() query: PaginateQuery) {
    return this.permissionService.list(query);
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.PERMISSION.SELECT_OPTIONS)
  selectOptions() {
    return this.permissionService.findAllForSelectOption();
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.PERMISSION.GET_BY_ID)
  findOne(@Payload() id: number) {
    return this.permissionService.findOne(id);
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.PERMISSION.UPDATE)
  update(@Payload() payload: UpdatePermissionRequestDto & { id: number }) {
    const { id, ...dto } = payload;
    return this.permissionService.update(id, dto);
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.PERMISSION.DELETE)
  async remove(@Payload() id: number): Promise<{ success: true }> {
    await this.permissionService.remove(id);
    return { success: true };
  }
}
