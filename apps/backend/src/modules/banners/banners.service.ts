import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  async getBanners(position?: string) {
    const where: any = { isActive: true };
    if (position) {
      where.position = position;
    }
    
    return this.prisma.banner.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}
