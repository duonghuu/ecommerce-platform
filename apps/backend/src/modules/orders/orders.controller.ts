import { Controller, Post, Get, Param, Body, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type {
  AuthenticatedRequest,
  OptionalAuthenticatedRequest,
  PaymentWebhookBody,
} from './interfaces/order.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Req() req: OptionalAuthenticatedRequest,
    @Body() dto: CreateOrderDto,
  ) {
    const userId = req.user?.sub || null;
    const orderData = await this.ordersService.createOrder(userId, dto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Đặt hàng thành công',
      data: orderData,
    };
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(
    @Req() req: AuthenticatedRequest,
    @Query() query: GetOrdersQueryDto,
  ) {
    const userId = req.user.sub;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const data = await this.ordersService.getMyOrders(userId, page, limit);

    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async getOrder(
    @Param('id') id: string,
    @Req() req: OptionalAuthenticatedRequest,
  ) {
    const userId = req.user?.sub;
    const userRole = req.user?.role;
    const order = await this.ordersService.getOrder(id, userId, userRole);
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
  async paymentWebhook(@Body() body: PaymentWebhookBody) {
    const result = await this.ordersService.handlePaymentWebhook(body);
    return result;
  }
}
