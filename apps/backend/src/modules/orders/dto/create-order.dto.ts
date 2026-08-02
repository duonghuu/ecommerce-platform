import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

export class CustomerInfoDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  cartId?: string;

  @ValidateNested()
  @Type(() => CustomerInfoDto)
  @IsNotEmpty()
  customerInfo: CustomerInfoDto;

  @IsString()
  @IsNotEmpty()
  shippingMethod: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsString()
  @IsOptional()
  orderNotes?: string;

  @IsString()
  @IsOptional()
  discountCode?: string;

  @IsOptional()
  guestItems?: { productId: string; quantity: number }[];
}
