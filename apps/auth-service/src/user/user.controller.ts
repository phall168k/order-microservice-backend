import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserResponseDto } from './dto/user-response.dto';
import { MESSAGE_PATTERN } from '@app/contracts/rmq.constants';
import { type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from 'libs/paginations/paginated-response.type';
import { UserEntity } from './entities/user.entity';

export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.USER.CREATE)
  create(@Payload() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.userService.create(dto);
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.USER.GET_ALL)
  findAll(@Payload() query: PaginateQuery): Promise<PaginatedResponse<UserEntity, UserResponseDto>> {
    return this.userService.list(query);
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.USER.GET_BY_ID)
  findOne(@Payload() id: number): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.USER.UPDATE)
  update(@Payload() payload: UpdateUserRequestDto & { id: number }): Promise<UserResponseDto> {
    const { id, ...dto } = payload; 
    return this.userService.update(id, dto);
  }

  @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.USER.DELETE)
  remove(@Payload() id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
