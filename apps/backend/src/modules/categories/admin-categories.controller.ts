import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống'),
  slug: z.string().optional(),
  iconUrl: z.string().optional(),
  parentId: z.string().uuid('Parent ID phải là UUID hợp lệ').nullable().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

const updateCategorySchema = createCategorySchema.partial();

@Controller('admin/categories')
// TODO: Thêm Guard xác thực và phân quyền (ADMIN, STAFF)
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  async getCategories(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('isActive') isActive: string,
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const activeFilter =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    return this.categoriesService.getAdminCategories(
      pageNum,
      limitNum,
      search,
      activeFilter,
    );
  }

  @Get(':id')
  async getCategory(@Param('id') id: string) {
    return this.categoriesService.getCategoryById(id);
  }

  @Post()
  // @UsePipes(new ZodValidationPipe(createCategorySchema))
  async createCategory(@Body() data: z.infer<typeof createCategorySchema>) {
    return this.categoriesService.createCategory(data);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateCategorySchema))
  async updateCategory(
    @Param('id') id: string,
    @Body() data: z.infer<typeof updateCategorySchema>,
  ) {
    return this.categoriesService.updateCategory(id, data);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}
