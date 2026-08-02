import React from 'react';
import Image from 'next/image';

export interface OrderResponse {
  orderId: string;
  orderCode: string;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
  paymentMethod: 'COD' | 'QR_CODE';
  paymentDetails?: {
    qrCodeUrl?: string;
    bankAccount?: string;
    bankName?: string;
    expiresAt?: string;
  };
}

export interface CheckoutModalProps {
  isOpen: boolean;
  type: 'COD' | 'QR_CODE' | null;
  orderData: OrderResponse | null;
  countdownTimer?: number;
  onClose: () => void;
  onConfirmSuccess?: () => void;
}

export default function CheckoutModal({
  isOpen,
  type,
  orderData,
  countdownTimer = 900, // 15 minutes default
  onClose,
  onConfirmSuccess
}: CheckoutModalProps) {

  if (!isOpen || !orderData) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-[600px] w-full overflow-hidden shadow-2xl transform transition-all">
        {/* Header */}
        <div className="bg-primary-container text-white p-4 text-center">
          <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
          <h3 className="font-headline-md font-bold">Đặt hàng thành công!</h3>
          <p className="text-white/80 text-sm">Mã đơn hàng: {orderData.orderCode}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {type === 'COD' && (
            <div className="text-center space-y-4">
              <span className="material-symbols-outlined text-6xl text-slate-300">local_shipping</span>
              <h4 className="font-bold text-lg">Thanh toán khi nhận hàng</h4>
              <p className="text-on-surface-variant">
                Bạn vui lòng chuẩn bị số tiền <strong className="text-primary-container">{formatCurrency(orderData.totalAmount)}</strong> để thanh toán cho shipper khi nhận hàng nhé.
              </p>
            </div>
          )}

          {type === 'QR_CODE' && (
            <div className="text-center space-y-4">
              <h4 className="font-bold text-lg">Quét mã QR để thanh toán</h4>
              <p className="text-on-surface-variant text-sm">
                Sử dụng App ngân hàng hoặc ví điện tử để quét mã.
              </p>

              <div className="bg-slate-50 p-4 rounded-xl inline-block border border-slate-200">
                {orderData.paymentDetails?.qrCodeUrl ? (
                  <div className="w-48 h-48 relative mx-auto">
                    <Image
                      src={orderData.paymentDetails.qrCodeUrl}
                      alt="QR Code"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-slate-200 flex items-center justify-center mx-auto rounded-lg">
                    <span className="text-slate-400">QR Code</span>
                  </div>
                )}
              </div>

              <div className="bg-orange-50 text-orange-800 p-3 rounded-lg flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">timer</span>
                <span>Thời gian thanh toán còn lại: <strong>{formatTime(countdownTimer)}</strong></span>
              </div>

              <p className="text-sm font-semibold">
                Số tiền: <span className="text-primary-container text-lg">{formatCurrency(orderData.totalAmount)}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end">
          {type === 'QR_CODE' && (
            <button
              onClick={onConfirmSuccess}
              className="flex-1 bg-primary text-white py-2 px-4 rounded-xl font-bold hover:bg-primary-container transition-colors"
            >
              Đã thanh toán
            </button>
          )}
          <button
            onClick={type === 'COD' ? onConfirmSuccess : onClose}
            className={`${type === 'COD' ? 'flex-1 bg-primary text-white hover:bg-primary-container' : 'flex-1 bg-slate-200 text-slate-700 hover:bg-slate-300'} py-2 px-4 rounded-xl font-bold transition-colors`}
          >
            {type === 'COD' ? 'Xác nhận' : 'Đóng'}
          </button>
        </div>
      </div>
    </div>
  );
}
