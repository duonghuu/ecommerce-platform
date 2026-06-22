import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories() {
    try {
      const data = await this.categoriesService.getCategories();
      return {
        status: 'success',
        data,
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new InternalServerErrorException({
        status: 'error',
        message: 'Không thể lấy danh sách danh mục.',
      });
    }
  }
}
