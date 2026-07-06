import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) { }

  async getCategories() {
    return this.prisma.category.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async getAdminCategories(page: number, limit: number, search?: string, isActive?: boolean) {
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (search) {
      where.name = { contains: search };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [data, totalItems] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async getCategoryById(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
    });
    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }
    return category;
  }

  async createCategory(data: any) {
    const slug = data.slug || generateSlug(data.name);

    const existing = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existing && !existing.deletedAt) {
      throw new BadRequestException('Slug đã tồn tại');
    }

    return this.prisma.category.create({
      data: {
        name: data.name,
        slug,
        iconUrl: data.iconUrl,
        parentId: data.parentId || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        displayOrder: data.displayOrder || 0,
      },
    });
  }

  async updateCategory(id: string, data: any) {
    const category = await this.getCategoryById(id);

    let slug = category.slug;
    if (data.name && !data.slug) {
      slug = generateSlug(data.name);
    } else if (data.slug) {
      slug = data.slug;
    }

    if (slug !== category.slug) {
      const existing = await this.prisma.category.findUnique({
        where: { slug },
      });
      if (existing && !existing.deletedAt) {
        throw new BadRequestException('Slug đã tồn tại');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name : category.name,
        slug,
        iconUrl: data.iconUrl !== undefined ? data.iconUrl : category.iconUrl,
        parentId: data.parentId !== undefined ? data.parentId : category.parentId,
        isActive: data.isActive !== undefined ? data.isActive : category.isActive,
        displayOrder: data.displayOrder !== undefined ? data.displayOrder : category.displayOrder,
      },
    });
  }

  async deleteCategory(id: string) {
    const category = await this.getCategoryById(id);

    // Kiểm tra danh mục con
    const childrenCount = await this.prisma.category.count({
      where: { parentId: id, deletedAt: null },
    });

    if (childrenCount > 0) {
      throw new BadRequestException('Không thể xóa danh mục đang có danh mục con');
    }

    // Kiểm tra sản phẩm
    const productsCount = await this.prisma.product.count({
      where: { categoryId: id, deletedAt: null },
    });

    if (productsCount > 0) {
      throw new BadRequestException('Không thể xóa danh mục đang chứa sản phẩm');
    }

    await this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Xóa danh mục thành công' };
  }
}
