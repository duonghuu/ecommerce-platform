import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) { }

  async register(data: RegisterDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new ConflictException('Email này đã được sử dụng. Vui lòng chọn email khác.');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await this.prisma.user.create({
        data: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          role: 'CUSTOMER',
        },
      });

      // Tạo payload cho token
      const tokenPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      // Tạo Access Token (15 phút)
      const accessToken = this.jwtService.sign(tokenPayload, {
        secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
        expiresIn: '15m',
      });

      // Tạo Refresh Token (7 ngày)
      const refreshToken = this.jwtService.sign(tokenPayload, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
        expiresIn: '7d',
      });

      // TODO: Lưu refreshToken vào Redis để quản lý luồng Refresh Token Rotation theo ARCHITECTURE.md

      // TODO: Đẩy message vào Queue để gửi Welcome Email (RabbitMQ/BullMQ)

      // Không trả về password
      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      console.error('Lỗi khi đăng ký:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Có lỗi xảy ra trong quá trình đăng ký.');
    }
  }

  async login(data: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác.');
      }

      const isPasswordValid = await bcrypt.compare(data.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác.');
      }

      // Tạo payload cho token
      const tokenPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      // Tạo Access Token (15 phút)
      const accessToken = this.jwtService.sign(tokenPayload, {
        secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
        expiresIn: '15m',
      });

      // Tạo Refresh Token (7 ngày)
      const refreshToken = this.jwtService.sign(tokenPayload, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
        expiresIn: '7d',
      });

      // TODO: Lưu refreshToken vào Redis để quản lý luồng Refresh Token Rotation theo ARCHITECTURE.md

      // Không trả về password
      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      console.error('Lỗi khi đăng nhập:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Có lỗi xảy ra trong quá trình đăng nhập.');
    }
  }

  async logout() {
    // TODO: Khi có Redis, đưa Access Token vào Blacklist và xóa Refresh Token khỏi hệ thống
    return { success: true };
  }

  async refreshToken(token: string) {
    if (!token) {
      throw new UnauthorizedException('Refresh token không tồn tại');
    }
    
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      });
      
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Tài khoản không hợp lệ hoặc đã bị khóa');
      }
      
      const tokenPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(tokenPayload, {
        secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
        expiresIn: '15m',
      });

      const newRefreshToken = this.jwtService.sign(tokenPayload, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
        expiresIn: '7d',
      });
      
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }
}
