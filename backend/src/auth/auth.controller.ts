import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';


@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('register')
    @ApiOperation({ summary: 'Registrasi user baru' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({ status:201, description: 'User berhasil terdaftar'})
    @ApiResponse({ status:401, description: 'Email sudah terdaftar'})
    register (@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    @ApiBody({ type: LoginDto})
    @ApiResponse({ status:201, description: 'User berhasil login'})
    @ApiResponse({ status:401, description: 'Email atau password salah'})
    login (@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}