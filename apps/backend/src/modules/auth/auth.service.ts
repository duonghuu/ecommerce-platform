import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
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
}
