import { AUTH_SERVICE, MESSAGE_PATTERN } from '@app/contracts/rmq.constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserRequestDto } from 'apps/auth-service/src/user/dto/create-user-request.dto';
import { UpdateUserRequestDto } from 'apps/auth-service/src/user/dto/update-user-request.dto';
import { UserResponseDto } from 'apps/auth-service/src/user/dto/user-response.dto';
import { UserSelectOptionResponseDto } from 'apps/auth-service/src/user/dto/user-select-option-response.dto';
import { UserEntity } from 'apps/auth-service/src/user/entities/user.entity';
import { BaseRpcClientService } from 'libs/common/microservices/base-rpc-client.service';
import { PaginatedResponse } from 'libs/paginations/paginated-response.type';
import { PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class UserService extends BaseRpcClientService {
    constructor(
        @Inject(AUTH_SERVICE)
        authServiceClient: ClientProxy,
    ) {
        super(authServiceClient, "Auth service");
    }

    public create(dto: CreateUserRequestDto): Promise<UserResponseDto> {
        return this.send(
            MESSAGE_PATTERN.AUTH_SERVICE.USER.CREATE,
            dto,
        );
    }

    public findAll(query: PaginateQuery): Promise<PaginatedResponse<UserEntity, UserResponseDto>> {
        return this.send(
            MESSAGE_PATTERN.AUTH_SERVICE.USER.GET_ALL,
            query,
        );
    }

    public findAllForSelectOptoins(): Promise<UserSelectOptionResponseDto[]> {
        return this.send(
            MESSAGE_PATTERN.AUTH_SERVICE.USER.SELECT_OPTIONS,
            {},
        );
    }

    public findOne(id: number): Promise<UserResponseDto> {
        return this.send(
            MESSAGE_PATTERN.AUTH_SERVICE.USER.GET_BY_ID,
            id,
        );
    }

    public update(id: number, dto: UpdateUserRequestDto): Promise<UserResponseDto> {
        return this.send(
            MESSAGE_PATTERN.AUTH_SERVICE.USER.UPDATE,
            {
                ...dto,
                id: id,
            },
        );
    }

    public delete(id: number): Promise<void> {
        return this.send(
            MESSAGE_PATTERN.AUTH_SERVICE.USER.DELETE,
            id,
        );
    }
}
