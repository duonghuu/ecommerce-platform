import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Param, 
  Query, 
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipeBuilder,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediasService } from './medias.service';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB cho video, cấu hình tuỳ ý

@Controller('admin')
// TODO: Thêm Guard xác thực và phân quyền (ADMIN, STAFF)
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: MAX_FILE_SIZE,
          message: 'Kích thước file vượt quá giới hạn (100MB)',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    ) file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Không tìm thấy file tải lên');
    }
    const media = await this.mediasService.saveMedia(file);
    return {
      status: 'success',
      data: media,
    };
  }

  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // Giới hạn tối đa 10 files
  async uploadMultipleFiles(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: MAX_FILE_SIZE,
          message: 'Kích thước file vượt quá giới hạn (100MB)',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    ) files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Không tìm thấy files tải lên');
    }
    const medias = await this.mediasService.saveMultipleMedias(files);
    return {
      status: 'success',
      data: medias,
    };
  }

  @Get('medias')
  async getMedias(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('mimeType') mimeType: string,
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    return this.mediasService.getMedias(pageNum, limitNum, search, mimeType);
  }

  @Delete('medias/:id')
  async deleteMedia(@Param('id') id: string) {
    return this.mediasService.deleteMedia(id);
  }
}
