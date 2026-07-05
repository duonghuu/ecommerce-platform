import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface IStorageService {
  uploadFile(file: Express.Multer.File): Promise<{ url: string; provider: string }>;
  deleteFile(url: string): Promise<void>;
}

@Injectable()
export class StorageService implements IStorageService {
  private readonly uploadDir = path.join(process.cwd(), '..', '..', 'public', 'uploads');

  constructor() {
    // Đảm bảo thư mục upload tồn tại
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; provider: string }> {
    try {
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const filePath = path.join(this.uploadDir, filename);

      fs.writeFileSync(filePath, file.buffer);

      // Trả về URL tương đối để truy cập file
      // Giả sử có cấu hình phục vụ thư mục tĩnh /uploads ở app gốc
      const url = `/uploads/${filename}`;
      
      return {
        url,
        provider: 'LOCAL',
      };
    } catch (error) {
      console.error('Error saving file:', error);
      throw new InternalServerErrorException('Lỗi hệ thống khi lưu file.');
    }
  }

  async deleteFile(url: string): Promise<void> {
    try {
      if (url.startsWith('/uploads/')) {
        const filename = url.replace('/uploads/', '');
        const filePath = path.join(this.uploadDir, filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      // Không throw error để việc xóa DB không bị gián đoạn nếu file vật lý mất
    }
  }
}
