import React from 'react';
import Image from 'next/image';

export interface CheckoutCartItem {
  id: string; // matches ICartItem
  name: string;
  price: number;
  quantity: number;
  thumbnailUrl: string;
}

export interface OrderSummarySidebarProps {
  items: CheckoutCartItem[];
  subTotal: number;
  shippingFee: number;
  discountAmount: number;
  discountCode?: string;
  total: number;
  isSubmitting: boolean;
  onApplyCoupon?: (code: string) => void;
  couponError?: string;
  isApplyingCoupon?: boolean;
}

export default function OrderSummarySidebar({
  items,
  subTotal,
  shippingFee,
  discountAmount,
  discountCode,
  total,
  isSubmitting,
  onApplyCoupon,
  couponError,
  isApplyingCoupon
}: OrderSummarySidebarProps) {
  const [localCouponCode, setLocalCouponCode] = React.useState('');
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="bg-white p-md rounded-2xl border border-slate-200 shadow-sm sticky top-24">
      <h2 className="text-headline-md font-bold mb-md">Đơn hàng của bạn</h2>
      
      {/* Item List */}
      <div className="space-y-md mb-lg border-b border-slate-100 pb-md">
        {items.map((item) => (
          <div key={item.id} className="flex gap-md group">
            <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 relative">
              <Image 
                src={item.thumbnailUrl} 
                alt={item.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex-grow flex flex-col justify-between py-1">
              <p className="font-semibold text-body-lg line-clamp-1">{item.name}</p>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-body-md">Số lượng: {item.quantity}</span>
                <span className="font-bold text-slate-900">{formatCurrency(item.price)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code */}
      <div className="mb-lg">
        <label className="text-label-md text-on-surface-variant block mb-2">Mã giảm giá</label>
        <div className="flex gap-xs">
          <input
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/10"
            placeholder="Nhập mã ưu đãi..."
            type="text"
            value={localCouponCode}
            onChange={(e) => setLocalCouponCode(e.target.value)}
            disabled={isApplyingCoupon || isSubmitting}
          />
          <button
            type="button"
            className="bg-slate-900 text-white px-md rounded-xl font-bold hover:bg-black transition-colors whitespace-nowrap disabled:opacity-50"
            onClick={() => onApplyCoupon && onApplyCoupon(localCouponCode)}
            disabled={!localCouponCode || isApplyingCoupon || isSubmitting}
          >
            {isApplyingCoupon ? 'ĐANG ÁP DỤNG...' : 'ÁP DỤNG'}
          </button>
        </div>
        {couponError && <p className="text-rose-500 text-sm mt-2">{couponError}</p>}
      </div>

      {/* Pricing Calculation */}
      <div className="space-y-sm text-body-lg mb-lg">
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Tạm tính</span>
          <span className="font-medium">{formatCurrency(subTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Phí vận chuyển</span>
          <span className="font-medium">{formatCurrency(shippingFee)}</span>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Giảm giá</span>
            <span className="bg-rose-100 text-rose-700 text-label-md px-3 py-1 rounded-full font-bold">
              {discountCode || `-${formatCurrency(discountAmount)}`}
            </span>
          </div>
        )}
        
        <div className="flex justify-between pt-sm border-t border-slate-100">
          <span className="text-headline-sm font-bold">Tổng cộng</span>
          <span className="text-headline-md font-extrabold text-primary-container">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <button 
        type="submit"
        disabled={isSubmitting}
        className={`w-full font-bold py-4 rounded-xl text-body-lg tracking-wider transition-all uppercase ${isSubmitting ? 'bg-orange-400 text-white cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-[0.98]'}`}
      >
        {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG NGAY'}
      </button>
      
      <p className="text-center text-label-md text-on-surface-variant mt-md flex items-center justify-center gap-xs">
        <span className="material-symbols-outlined text-sm">verified_user</span>
        Thanh toán an toàn & bảo mật 256-bit
      </p>
    </div>
  );
}
