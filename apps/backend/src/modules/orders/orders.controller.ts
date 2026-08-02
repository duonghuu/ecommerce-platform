import { Controller, Post, Get, Param, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Req() req: any, @Body() dto: CreateOrderDto) {
    const userId = req.user?.sub || null;
    const orderData = await this.ordersService.createOrder(userId, dto);
    
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Đặt hàng thành công',
      data: orderData,
    };
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    const order = await this.ordersService.getOrder(id);
    return {
      statusCode: HttpStatus.OK,
      data: order,
    };
  }

  @Get(':id/payment-status')
  async getPaymentStatus(@Param('id') id: string) {
    const status = await this.ordersService.getPaymentStatus(id);
    return {
      statusCode: HttpStatus.OK,
      data: status,
    };
  }

  @Post('webhook/payment')
  @HttpCode(HttpStatus.OK)
  async paymentWebhook(@Body() body: any) {
    const result = await this.ordersService.handlePaymentWebhook(body);
    return result;
  }
}
