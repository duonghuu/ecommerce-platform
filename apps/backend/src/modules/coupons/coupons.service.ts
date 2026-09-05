import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) { }

  async validate(validateCouponDto: ValidateCouponDto) {
    const { code, orderValue } = validateCouponDto;

    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      throw new NotFoundException('Mã giảm giá không tồn tại');
    }

    if (!coupon.isActive) {
      throw new BadRequestException('Mã giảm giá đã bị khóa');
    }

    const now = new Date();
    if (now < coupon.startDate) {
      throw new BadRequestException('Mã giảm giá chưa đến thời gian áp dụng');
    }

    if (now > coupon.endDate) {
      throw new BadRequestException('Mã giảm giá đã hết hạn');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException('Mã giảm giá đã hết lượt sử dụng');
    }

    if (coupon.minOrderValue && orderValue < Number(coupon.minOrderValue)) {
      throw new BadRequestException(`Đơn hàng phải đạt tối thiểu ${coupon.minOrderValue}đ để áp dụng mã này`);
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (orderValue * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
        discountAmount = Number(coupon.maxDiscount);
      }
    } else {
      discountAmount = Number(coupon.discountValue);
    }

    // Ensure discount doesn't exceed order value
    if (discountAmount > orderValue) {
      discountAmount = orderValue;
    }

    return {
      success: true,
      message: 'Áp dụng mã giảm giá thành công',
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        discountAmount: discountAmount,
      }
    };
  }
}
