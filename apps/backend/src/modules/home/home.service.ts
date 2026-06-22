import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async getHomeData() {
    // 1. Get Hero Banners
    const heroBanners = await this.prisma.banner.findMany({
      where: {
        isActive: true,
        position: 'home_hero',
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        imageUrl: true,
        targetUrl: true,
      },
    });

    // 2. Get Featured Categories
    const featuredCategories = await this.prisma.category.findMany({
      where: {
        isFeatured: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        iconUrl: true,
      },
    });

    // 3. Get Featured Products
    const featuredProducts = await this.prisma.product.findMany({
      where: {
        isFeatured: true,
      },
      orderBy: {
        salesCount: 'desc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        salePrice: true,
        thumbnailUrl: true,
        stock: true,
      },
      take: 8,
    });

    const formattedFeaturedProducts = featuredProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      thumbnailUrl: product.thumbnailUrl,
      stock: product.stock,
      isAvailable: product.stock > 0,
    }));

    // 4. Social Proof
    const totalUsers = 500;
    const socialProof = {
      totalUsers,
      message: `Hơn ${totalUsers}+ anh em dev đã nạp năng lượng tại đây`,
    };

    return {
      heroBanners,
      featuredCategories,
      featuredProducts: formattedFeaturedProducts,
      socialProof,
    };
  }
}
