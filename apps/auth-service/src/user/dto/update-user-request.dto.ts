import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserRequestDto } from './create-user-request.dto';

export class UpdateUserRequestDto extends PartialType(CreateUserRequestDto) {
    @ApiProperty()
    isAdmin?: boolean;
}
