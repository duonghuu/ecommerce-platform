import { Controller, Post, Get, Body, UsePipes, UseGuards, HttpCode, HttpStatus, Res, Req, UnauthorizedException } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterPayloadSchema } from './dto/register.dto';
import type { RegisterDto } from './dto/register.dto';
import { LoginPayloadSchema } from './dto/login.dto';
import type { LoginDto } from './dto/login.dto';
import { ChangePasswordPayloadSchema } from './dto/change-password.dto';
import type { ChangePasswordDto } from './dto/change-password.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(RegisterPayloadSchema))
  async register(@Body() payload: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.register(payload);
    
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { refreshToken, ...responseData } = data;

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Đăng ký tài khoản thành công',
      data: responseData,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(LoginPayloadSchema))
  async login(@Body() payload: LoginDto, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.login(payload);
    
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    const { refreshToken, ...responseData } = data;

    return {
      statusCode: HttpStatus.OK,
      message: 'Đăng nhập thành công',
      data: responseData,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.authService.logout();
    res.clearCookie('refreshToken');
    return {
      statusCode: HttpStatus.OK,
      message: 'Đăng xuất thành công',
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshTokenFromCookie = req.cookies?.refreshToken;
    if (!refreshTokenFromCookie) {
      throw new UnauthorizedException('Không tìm thấy refresh token trong cookie');
    }

    const data = await this.authService.refreshToken(refreshTokenFromCookie);

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Làm mới token thành công',
      data: {
        accessToken: data.accessToken
      },
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const userId = (req as any).user.sub;
    const profile = await this.authService.getProfile(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy thông tin cá nhân thành công',
      data: profile,
    };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(ChangePasswordPayloadSchema))
  async changePassword(
    @Req() req: Request,
    @Body() payload: ChangePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = (req as any).user.sub;
    await this.authService.changePassword(userId, payload);

    // Clear refresh token cookie since the user is logged out
    res.clearCookie('refreshToken');

    return {
      statusCode: HttpStatus.OK,
      message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.',
    };
  }
}
