"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import CustomerInfoForm from './CustomerInfoForm';
import OrderSummarySidebar from './OrderSummarySidebar';
import CheckoutModal, { OrderResponse } from './CheckoutModal';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/cartStore';
import { createOrderServer } from '../../app/actions/checkout';

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal('')),
  address: z.string().min(5, "Vui lòng nhập đầy đủ địa chỉ giao hàng"),
  orderNotes: z.string().optional(),
  shippingMethod: z.string(),
  paymentMethod: z.enum(['COD', 'QR_CODE']),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Vui lòng đồng ý với điều khoản dịch vụ" })
  })
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutClientProps {
  initialData: any; // User profile if any
}

export default function CheckoutClient({ initialData }: CheckoutClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const cartItems = useCartStore((state) => state.cartItems);
  const subTotal = useCartStore((state) => state.getSubtotal());
  const clearCart = useCartStore((state) => state.clearCart);
  
  // Shipping and Discount simulation
  const shippingFee = 40000;
  const discountAmount = 0;
  const discountCode = '';
  const total = subTotal + shippingFee - discountAmount;

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'COD' | 'QR_CODE' | null;
    orderData: OrderResponse | null;
  }>({
    isOpen: false,
    type: null,
    orderData: null
  });
  const [countdown, setCountdown] = useState(900); // 15 mins

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: initialData.customerInfo?.fullName || '',
      phone: initialData.customerInfo?.phone || '',
      email: initialData.customerInfo?.email || '',
      address: initialData.customerInfo?.address || '',
      shippingMethod: 'standard',
      paymentMethod: 'COD',
      termsAccepted: undefined
    }
  });

  const paymentMethod = watch('paymentMethod');

  useEffect(() => {
    setIsMounted(true);
    let timer: NodeJS.Timeout;
    if (modalState.isOpen && modalState.type === 'QR_CODE' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [modalState, countdown]);

  const onSubmit = async (data: CheckoutFormValues) => {
    if (cartItems.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }

    setIsSubmitting(true);
    
    const payload = {
      customerInfo: {
        fullName: data.fullName,
        email: data.email || undefined,
        phone: data.phone,
        address: data.address
      },
      shippingMethod: data.shippingMethod,
      paymentMethod: data.paymentMethod,
      orderNotes: data.orderNotes || undefined,
      guestItems: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    const res = await createOrderServer(payload);
    
    setIsSubmitting(false);

    if (res.success && res.data) {
      clearCart();
      setModalState({
        isOpen: true,
        type: res.data.paymentMethod,
        orderData: res.data
      });
      setCountdown(900);
    } else {
      alert(res.message || 'Lỗi khi đặt hàng');
    }
  };

  const handleConfirmSuccess = () => {
    setModalState({ ...modalState, isOpen: false });
    // Redirect to home or order tracking page
    router.push('/');
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start pt-24">
        {/* Left Column: Checkout Information */}
        <div className="lg:col-span-7">
          <CustomerInfoForm register={register} errors={errors} />
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          {!isMounted ? (
            <div className="bg-white p-md rounded-2xl border border-slate-200 shadow-sm animate-pulse h-96"></div>
          ) : (
            <OrderSummarySidebar 
              items={cartItems as any}
              subTotal={subTotal}
              shippingFee={shippingFee}
              discountAmount={discountAmount}
              discountCode={discountCode}
              total={total}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </form>

      <CheckoutModal 
        isOpen={modalState.isOpen}
        type={modalState.type}
        orderData={modalState.orderData}
        countdownTimer={countdown}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirmSuccess={handleConfirmSuccess}
      />
    </>
  );
}
