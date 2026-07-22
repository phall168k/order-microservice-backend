import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { RpcException } from '@nestjs/microservices';
import { PasswordHash } from 'libs/utils/password-hash.util';
import { TokenService } from './token.service';
import { UserMapper } from '../../user/user.mapper';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
    ) {}

    public async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
        try {
            const user = await this.userService.findOneByUsername(dto.username);
            if (!user) {
                throw new RpcException({
                    code: "UNAUTHORIZED",
                    message: "Unauthorized",
                });
            }

            const isMatched = await PasswordHash.verify(dto.password, user.password);
            if (!isMatched) {
                throw new RpcException({
                    code: "UNAUTHORIZED",
                    message: "Unauthorized",
                });
            }

            const payload = await this.payloadGenerate(user.username);
            return payload;
        } catch (error) {
            throw error;
        }
    }

    private async payloadGenerate(username: string): Promise<LoginResponseDto> {
        const user = await this.userService.findOneByUsername(username);
        if (!user) {
            throw new RpcException({
                code: "UNAUTHORIZED",
                message: "Unauthorized",
            });
        }

        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        };

        const roles = await user.roles;
        const AllPermissions = await Promise.all(
            roles
                .map((role) => role.permissions)
                .map(async (perm) => (await perm).flatMap((p) => p.name)),
        );
        const uniquePermissions = Array.from(new Set(AllPermissions.flat()));
        const userMapped = await UserMapper.toDto(user);
        const userRoles = roles.map((item) => item.name);

        const token = await this.tokenService.generateAuthToken(payload);
        return {
            user: {
                ...userMapped,
                roles: userRoles,
                permissions: uniquePermissions,
            },
            token,
        };
    }
}
