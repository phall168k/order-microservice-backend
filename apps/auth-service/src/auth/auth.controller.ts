import { Controller } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERN } from '@app/contracts/rmq.constants';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern(MESSAGE_PATTERN.AUTH_SERVICE.LOGIN)
    public login(@Payload() dto: LoginRequestDto): Promise<LoginResponseDto> {
        return this.authService.login(dto);
    }
}
