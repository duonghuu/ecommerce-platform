import { Controller, Get, Query, InternalServerErrorException, UsePipes } from '@nestjs/common';
import { BannersService } from './banners.service';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

const getBannersSchema = z.object({
  position: z.string().optional(),
});

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(getBannersSchema))
  async getBanners(@Query() query: any) {
    try {
      const data = await this.bannersService.getBanners(query.position);
      return {
        status: 'success',
        data,
      };
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw new InternalServerErrorException({
        status: 'error',
        message: 'Không thể lấy danh sách banner.',
      });
    }
  }
}
