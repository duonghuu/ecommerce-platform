import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto, SyncCartDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.sub);
  }

  @Post('items')
  @HttpCode(HttpStatus.OK)
  addItem(@Req() req: any, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(req.user.sub, dto);
  }

  @Put('items/:productId')
  updateItem(@Req() req: any, @Param('productId') productId: string, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateItem(req.user.sub, productId, dto);
  }

  @Delete('items/:productId')
  removeItem(@Req() req: any, @Param('productId') productId: string) {
    return this.cartService.removeItem(req.user.sub, productId);
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  syncCart(@Req() req: any, @Body() dto: SyncCartDto) {
    return this.cartService.syncCart(req.user.sub, dto);
  }
}
