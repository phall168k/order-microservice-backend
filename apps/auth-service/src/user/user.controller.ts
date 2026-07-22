import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { UpdateUserRequestDto } from "./dto/update-user-request.dto";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UserResponseDto } from "./dto/user-response.dto";
import { MESSAGE_PATTERN } from "@app/contracts/rmq.constants";
import { type PaginateQuery } from "nestjs-paginate";
import { PaginatedResponse } from "libs/paginations/paginated-response.type";
import { UserEntity } from "./entities/user.entity";
import { UserSelectOptionResponseDto } from "./dto/user-select-option-response.dto";
import { UserService } from "./user.service";
import { Controller } from "@nestjs/common";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.USER.CREATE)
  create(@Payload() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.userService.create(dto);
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.USER.GET_ALL)
  findAll(
    @Payload() query: PaginateQuery,
  ): Promise<PaginatedResponse<UserEntity, UserResponseDto>> {
    return this.userService.list(query);
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.USER.SELECT_OPTIONS)
  findAllForSelectOption(): Promise<UserSelectOptionResponseDto[]> {
    return this.userService.findAllForSelection();
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.USER.GET_BY_ID)
  findOne(@Payload() id: number): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.USER.UPDATE)
  update(
    @Payload() payload: UpdateUserRequestDto & { id: number },
  ): Promise<UserResponseDto> {
    const { id, ...dto } = payload;
    return this.userService.update(id, dto);
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.USER.DELETE)
  async remove(@Payload() id: number): Promise<{ success: true }> {
    await this.userService.remove(id);
    return { success: true };
  }
}
