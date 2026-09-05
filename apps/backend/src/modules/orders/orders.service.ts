import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentMethod, OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) { }

  async createOrder(userId: string | null, dto: CreateOrderDto) {
    let itemsToCheckout: { productId: string; quantity: number }[] = [];
    let cartIdToRemove: string | null = null;

    if (userId) {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: { items: true },
      });
      if (cart && cart.items.length > 0) {
        itemsToCheckout = cart.items;
        cartIdToRemove = cart.id;
      }
    } else if (dto.cartId) {
      const cart = await this.prisma.cart.findUnique({
        where: { id: dto.cartId },
        include: { items: true },
      });
      if (cart && cart.items.length > 0) {
        itemsToCheckout = cart.items;
        cartIdToRemove = cart.id;
      }
    }

    if (itemsToCheckout.length === 0 && dto.guestItems && dto.guestItems.length > 0) {
      itemsToCheckout = dto.guestItems;
    }

    if (itemsToCheckout.length === 0) {
      throw new BadRequestException('Giỏ hàng trống hoặc không tồn tại');
    }

    // 2. Transaction for order creation
    return await this.prisma.$transaction(async (tx) => {
      // 2.1 Calculate prices and check stock
      let subTotal = 0;
      const orderItems: any[] = [];

      for (const item of itemsToCheckout) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new BadRequestException(`Sản phẩm với ID ${item.productId} không tồn tại`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(`Sản phẩm ${product.name} không đủ số lượng (còn ${product.stock})`);
        }

        const price = product.salePrice || product.price;
        subTotal += Number(price) * item.quantity;

        // Deduct stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            salesCount: { increment: item.quantity }
          },
        });

        orderItems.push({
          productId: item.productId,
          productName: product.name,
          productImage: product.thumbnailUrl,
          price: price,
          quantity: item.quantity,
        });
      }

      const shippingFee = 40000; // Hardcode for now based on plan
      let discountAmount = 0;

      // Validate and apply coupon
      if (dto.discountCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: dto.discountCode }
        });

        if (coupon && coupon.isActive && new Date() >= coupon.startDate && new Date() <= coupon.endDate) {
          if (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) {
             if (!coupon.minOrderValue || subTotal >= Number(coupon.minOrderValue)) {
                if (coupon.discountType === 'PERCENTAGE') {
                  discountAmount = (subTotal * Number(coupon.discountValue)) / 100;
                  if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
                    discountAmount = Number(coupon.maxDiscount);
                  }
                } else {
                  discountAmount = Number(coupon.discountValue);
                }
                if (discountAmount > subTotal) discountAmount = subTotal;

                // Increase usage count
                await tx.coupon.update({
                  where: { id: coupon.id },
                  data: { usageCount: { increment: 1 } }
                });
             }
          }
        } else {
           dto.discountCode = undefined; // clear invalid code
        }
      }

      const totalAmount = subTotal + shippingFee - discountAmount;
      const orderCode = `TB-${Math.floor(100000 + Math.random() * 900000)}`;

      // 2.2 Create Order
      const order = await tx.order.create({
        data: {
          code: orderCode,
          userId: userId,
          customerName: dto.customerInfo.fullName,
          customerPhone: dto.customerInfo.phone,
          customerEmail: dto.customerInfo.email,
          shippingAddress: dto.customerInfo.address,
          shippingMethod: dto.shippingMethod,
          shippingFee: shippingFee,
          paymentMethod: dto.paymentMethod,
          paymentStatus: PaymentStatus.PENDING,
          status: OrderStatus.PENDING,
          subTotal: subTotal,
          discountAmount: discountAmount,
          discountCode: dto.discountCode,
          totalAmount: totalAmount,
          notes: dto.orderNotes,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        }
      });

      // 2.3 Clear cart if applicable
      if (cartIdToRemove) {
        await tx.cartItem.deleteMany({
          where: { cartId: cartIdToRemove },
        });
      }

      // 2.4 Prepare response
      let paymentDetails: any = undefined;
      if (order.paymentMethod === PaymentMethod.QR_CODE) {
        paymentDetails = {
          qrCodeUrl: `https://api.vietqr.io/image/970415-113366668888-2O5vYyZ.jpg?amount=${totalAmount}&addInfo=${orderCode}`,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        };
      }

      return {
        orderId: order.id,
        orderCode: order.code,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentDetails,
      };
    });
  }

  async getOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    return order;
  }

  async getPaymentStatus(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: { paymentStatus: true, status: true },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    return order;
  }

  async handlePaymentWebhook(body: any) {
    const { orderCode, status } = body;

    if (status === 'SUCCESS') {
      const order = await this.prisma.order.update({
        where: { code: orderCode },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.CONFIRMED
        },
      });
      return { success: true, orderId: order.id };
    }
    return { success: false };
  }
}
