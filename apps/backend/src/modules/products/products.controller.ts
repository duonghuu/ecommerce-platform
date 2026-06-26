import { Controller, Get, Query, InternalServerErrorException, UsePipes, Param, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

const getProductsSchema = z.object({
  page: z.preprocess((val) => (val !== undefined ? Number(val) : 1), z.number().int().min(1).default(1)),
  limit: z.preprocess((val) => (val !== undefined ? Number(val) : 20), z.number().int().min(1).max(100).default(20)),
  categoryId: z.string().optional(),
  minPrice: z.preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number().min(0).optional()),
  maxPrice: z.preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number().min(0).optional()),
  sortBy: z.enum(['latest', 'price_asc', 'price_desc', 'featured']).default('latest'),
});

type GetProductsDto = z.infer<typeof getProductsSchema>;

const searchSuggestSchema = z.object({
  keyword: z.string().min(1, 'Keyword is required'),
  limit: z.preprocess((val) => (val !== undefined ? Number(val) : 5), z.number().int().min(1).max(20).default(5)),
});

type SearchSuggestDto = z.infer<typeof searchSuggestSchema>;

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @UsePipes(new ZodValidationPipe(getProductsSchema))
  async getProducts(@Query() query: GetProductsDto) {
    try {
      const data = await this.productsService.getProducts(query);
      return {
        status: 'success',
        data,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new InternalServerErrorException({
        status: 'error',
        message: 'Không thể lấy danh sách sản phẩm. Vui lòng thử lại.',
      });
    }
  }

  @Get('suggest')
  @UsePipes(new ZodValidationPipe(searchSuggestSchema))
  async suggestProducts(@Query() query: SearchSuggestDto) {
    try {
      const data = await this.productsService.suggestProducts(query);
      return {
        status: 'success',
        data,
      };
    } catch (error) {
      console.error('Error in search suggest:', error);
      throw new InternalServerErrorException({
        status: 'error',
        message: 'Lỗi khi tìm kiếm gợi ý. Vui lòng thử lại.',
      });
    }
  }

  @Get(':id')
  async getOneProduct(@Param('id') id: string) {
    try {
      const data = await this.productsService.getOneProduct(id);
      if (!data) {
        throw new NotFoundException({
          status: 'error',
          message: 'Không tìm thấy sản phẩm.',
        });
      }
      return {
        status: 'success',
        data,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(`Error fetching product ${id}:`, error);
      throw new InternalServerErrorException({
        status: 'error',
        message: 'Không thể lấy chi tiết sản phẩm. Vui lòng thử lại.',
      });
    }
  }

  @Get(':id/related')
  async getRelatedProducts(@Param('id') id: string, @Query('limit') limitStr?: string) {
    try {
      const limit = limitStr ? parseInt(limitStr, 10) : 4;
      const data = await this.productsService.getRelatedProducts(id, limit);
      return {
        status: 'success',
        data,
      };
    } catch (error) {
      console.error(`Error fetching related products for ${id}:`, error);
      throw new InternalServerErrorException({
        status: 'error',
        message: 'Không thể lấy danh sách sản phẩm liên quan. Vui lòng thử lại.',
      });
    }
  }
}
