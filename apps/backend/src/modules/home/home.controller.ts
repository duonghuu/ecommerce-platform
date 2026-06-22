import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  async getHomeData() {
    try {
      const data = await this.homeService.getHomeData();
      return {
        status: 'success',
        data,
      };
    } catch (error) {
      console.error('Error fetching home data:', error);
      throw new InternalServerErrorException({
        status: 'error',
        message: 'Không thể tải dữ liệu trang chủ lúc này. Vui lòng thử lại sau.',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}
