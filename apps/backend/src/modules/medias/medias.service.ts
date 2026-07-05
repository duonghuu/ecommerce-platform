import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from './storage.service';

@Injectable()
export class MediasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async saveMedia(file: Express.Multer.File, userId?: string) {
    // Lưu file vật lý
    const { url, provider } = await this.storageService.uploadFile(file);

    // Lưu vào Database
    const media = await this.prisma.media.create({
      data: {
        filename: file.originalname,
        url,
        mimeType: file.mimetype,
        size: file.size,
        provider,
        uploadedById: userId || null,
      },
    });

    return media;
  }

  async saveMultipleMedias(files: Express.Multer.File[], userId?: string) {
    const results = await Promise.all(
      files.map(file => this.saveMedia(file, userId))
    );
    return results;
  }

  async getMedias(page: number, limit: number, search?: string, mimeType?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = { deletedAt: null };
    
    if (search) {
      where.filename = { contains: search };
    }
    
    if (mimeType) {
      where.mimeType = { startsWith: mimeType.replace('/*', '') };
    }

    const [data, totalItems] = await Promise.all([
      this.prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.media.count({ where }),
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

  async deleteMedia(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media || media.deletedAt) {
      throw new NotFoundException('Không tìm thấy file');
    }

    // Soft delete trong DB
    await this.prisma.media.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Tuỳ chọn: Xóa file vật lý để tiết kiệm dung lượng
    // await this.storageService.deleteFile(media.url);

    return { message: 'Xóa file thành công' };
  }
}
