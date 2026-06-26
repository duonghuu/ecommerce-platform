import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProducts(query: any) {
    const { page, limit, categoryId, minPrice, maxPrice, sortBy } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: any = { createdAt: 'desc' }; // default 'latest'
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (sortBy === 'featured') orderBy = { isFeatured: 'desc' };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: { name: true, slug: true }
          }
        }
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async suggestProducts(query: { keyword: string; limit: number }) {
    const { keyword, limit } = query;
    
    // Tìm kiếm sử dụng contains (LIKE %keyword%)
    const products = await this.prisma.product.findMany({
      where: {
        name: {
          contains: keyword,
        }
      },
      take: limit,
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
      }
    });

    return products.map(p => {
      let image = '';
      if (p.images && Array.isArray(p.images) && p.images.length > 0) {
        image = p.images[0] as string;
      }
      return {
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image,
      };
    });
  }

  async getOneProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        }
      }
    });
    return product;
  }

  async getRelatedProducts(id: string, limit: number = 4) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { categoryId: true }
    });

    if (!product) return [];

    return this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: id }
      },
      take: limit,
      orderBy: { salesCount: 'desc' }
    });
  }
}
