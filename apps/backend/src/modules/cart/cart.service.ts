import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddCartItemDto, UpdateCartItemDto, SyncCartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    try {
      let cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { userId },
          include: {
            items: { include: { product: true } },
          },
        });
      }

      let subTotal = 0;
      const items = cart.items.map((item) => {
        const price = Number(item.product.salePrice || item.product.price);
        const itemTotal = item.quantity * price;
        subTotal += itemTotal;
        
        const isStockError = item.quantity > item.product.stock;

        return {
          cartItemId: item.id,
          quantity: item.quantity,
          product: {
            ...item.product,
            price: Number(item.product.price),
            salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
          },
          itemTotal,
          isStockError,
        };
      });

      return {
        success: true,
        data: {
          cartId: cart.id,
          items,
          summary: {
            subTotal,
            shippingFee: 0,
            grandTotal: subTotal,
          },
        }
      };
    } catch (error) {
      console.error('Lỗi lấy giỏ hàng:', error);
      throw new InternalServerErrorException('Lỗi máy chủ khi lấy thông tin giỏ hàng');
    }
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    try {
      const { productId, quantity } = dto;
      
      let cart = await this.prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        cart = await this.prisma.cart.create({ data: { userId } });
      }

      const product = await this.prisma.product.findUnique({ where: { id: productId } });
      if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

      const existingItem = await this.prisma.cartItem.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId } },
      });

      const newQuantity = (existingItem?.quantity || 0) + quantity;
      if (newQuantity > product.stock) {
        throw new BadRequestException('Số lượng yêu cầu vượt quá tồn kho hiện tại');
      }

      if (existingItem) {
        await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity: newQuantity,
          },
        });
      }

      return this.getCart(userId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      console.error('Lỗi thêm sản phẩm:', error);
      throw new InternalServerErrorException('Lỗi máy chủ khi thêm sản phẩm vào giỏ');
    }
  }

  async updateItem(userId: string, productId: string, dto: UpdateCartItemDto) {
    try {
      const cart = await this.prisma.cart.findUnique({ where: { userId } });
      if (!cart) throw new NotFoundException('Giỏ hàng không tồn tại');

      const product = await this.prisma.product.findUnique({ where: { id: productId } });
      if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

      if (dto.quantity > product.stock) {
        throw new BadRequestException('Số lượng yêu cầu vượt quá tồn kho');
      }

      const existingItem = await this.prisma.cartItem.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId } },
      });

      if (!existingItem) {
        throw new NotFoundException('Sản phẩm không có trong giỏ hàng');
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: dto.quantity },
      });

      return this.getCart(userId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      console.error('Lỗi cập nhật sản phẩm:', error);
      throw new InternalServerErrorException('Lỗi máy chủ khi cập nhật giỏ hàng');
    }
  }

  async removeItem(userId: string, productId: string) {
    try {
      const cart = await this.prisma.cart.findUnique({ where: { userId } });
      if (!cart) throw new NotFoundException('Giỏ hàng không tồn tại');

      const existingItem = await this.prisma.cartItem.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId } },
      });

      if (existingItem) {
        await this.prisma.cartItem.delete({
          where: { id: existingItem.id },
        });
      }

      return this.getCart(userId);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Lỗi xóa sản phẩm:', error);
      throw new InternalServerErrorException('Lỗi máy chủ khi xóa sản phẩm');
    }
  }

  async syncCart(userId: string, dto: SyncCartDto) {
    try {
      let cart = await this.prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        cart = await this.prisma.cart.create({ data: { userId } });
      }

      for (const item of dto.items) {
        const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) continue;

        const existingItem = await this.prisma.cartItem.findUnique({
          where: { cartId_productId: { cartId: cart.id, productId: item.productId } },
        });

        const newQuantity = (existingItem?.quantity || 0) + item.quantity;
        const finalQuantity = Math.min(newQuantity, product.stock);

        if (finalQuantity > 0) {
          if (existingItem) {
             await this.prisma.cartItem.update({
               where: { id: existingItem.id },
               data: { quantity: finalQuantity },
             });
          } else {
             await this.prisma.cartItem.create({
               data: {
                 cartId: cart.id,
                 productId: item.productId,
                 quantity: finalQuantity,
               }
             });
          }
        }
      }

      return this.getCart(userId);
    } catch (error) {
      console.error('Lỗi đồng bộ giỏ hàng:', error);
      throw new InternalServerErrorException('Lỗi máy chủ khi đồng bộ giỏ hàng');
    }
  }
}
