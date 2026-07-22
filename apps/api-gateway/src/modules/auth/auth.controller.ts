import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginRequestDto } from 'apps/auth-service/src/auth/dto/login-request.dto';
import { LoginResponseDto } from 'apps/auth-service/src/auth/dto/login-response.dto';
import { AuthService } from './auth.service';

@ApiTags("Auth")
@Controller({
    path: "auth",
    version: "1",
})
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    @ApiOperation({ summary: "Login with user and password" })
    @ApiOkResponse({ type: LoginResponseDto })
    @ApiUnauthorizedResponse({ description: "Unthorized" })
    public login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
        return this.authService.login(dto);
    }
}
