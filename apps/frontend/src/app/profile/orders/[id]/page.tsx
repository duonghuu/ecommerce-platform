import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getOrderDetailServer } from '@/app/actions/orders';
import { checkAuth } from '@/app/actions/auth';
import { statusMap } from '@/components/auth/OrderHistory';

interface ProfileOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProfileOrderDetailPageProps) {
  const resolvedParams = await params;
  return {
    title: `Chi tiết đơn hàng #${resolvedParams.id} - TechBite Pro`,
    description: 'Xem chi tiết thông tin đơn hàng và sản phẩm',
  };
}

export default async function ProfileOrderDetailPage({ params }: ProfileOrderDetailPageProps) {
  const isAuth = await checkAuth();
  if (!isAuth) {
    redirect('/login');
  }

  const resolvedParams = await params;
  const orderResult = await getOrderDetailServer(resolvedParams.id);

  if (!orderResult.success || !orderResult.data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-sm">
        <span className="material-symbols-outlined text-5xl text-amber-500 mb-3">help_outline</span>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy đơn hàng</h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          Đơn hàng không tồn tại hoặc bạn không có quyền xem thông tin đơn hàng này.
        </p>
        <Link
          href="/profile/orders"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Về danh sách đơn hàng
        </Link>
      </div>
    );
  }

  const order = orderResult.data;
  const statusConfig = statusMap[order.status] || statusMap.PENDING;
  const formattedDate = new Date(order.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const subTotalNumber = Number(order.subTotal) || 0;
  const shippingFeeNumber = Number(order.shippingFee) || 0;
  const discountAmountNumber = Number(order.discountAmount) || 0;
  const totalAmountNumber = Number(order.totalAmount) || 0;

  const qrCodeUrl = `https://api.vietqr.io/image/970415-113366668888-2O5vYyZ.jpg?amount=${totalAmountNumber}&addInfo=${order.code}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/profile" className="hover:text-primary transition-colors">Tài khoản</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link href="/profile/orders" className="hover:text-primary transition-colors">Lịch sử đơn hàng</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-900 font-medium">#{order.code}</span>
      </div>

      {/* Order Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900">Đơn hàng #{order.code}</h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
              <span className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-1.5`}></span>
              {statusConfig.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Thời gian đặt hàng: {formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/profile/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Danh sách đơn
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">shopping_bag</span>
            Mua thêm
          </Link>
        </div>
      </div>

      {/* Order Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Items & Delivery Info) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Items List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">inventory_2</span>
              Danh sách món ({order.items.length})
            </h2>

            <div className="divide-y divide-slate-100">
              {order.items.map((item) => {
                const itemPrice = Number(item.price) || 0;
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <span className="material-symbols-outlined text-2xl">fastfood</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{item.productName}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Số lượng: <span className="font-semibold text-slate-700">{item.quantity}</span> x {itemPrice.toLocaleString('vi-VN')} đ
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-bold text-red-600">
                        {itemTotal.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
              Thông tin giao hàng
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Người nhận</span>
                <p className="font-semibold text-slate-800 text-sm">{order.customerName}</p>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Số điện thoại</span>
                <p className="font-semibold text-slate-800 text-sm">{order.customerPhone}</p>
              </div>
              {order.customerEmail && (
                <div>
                  <span className="text-slate-500 block mb-1">Email</span>
                  <p className="font-medium text-slate-800 text-sm">{order.customerEmail}</p>
                </div>
              )}
              <div>
                <span className="text-slate-500 block mb-1">Phương thức vận chuyển</span>
                <p className="font-medium text-slate-800 text-sm">{order.shippingMethod}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-slate-500 block mb-1">Địa chỉ nhận hàng</span>
                <p className="font-medium text-slate-800 text-sm">{order.shippingAddress}</p>
              </div>
              {order.notes && (
                <div className="md:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 block mb-1 font-medium">Ghi chú từ bạn</span>
                  <p className="italic text-slate-700">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (Summary & Payment) */}
        <div className="space-y-6">
          
          {/* Cost Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">receipt</span>
              Chi tiết thanh toán
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính</span>
                <span className="font-medium text-slate-800">{subTotalNumber.toLocaleString('vi-VN')} đ</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-slate-800">{shippingFeeNumber.toLocaleString('vi-VN')} đ</span>
              </div>

              {discountAmountNumber > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Giảm giá {order.discountCode ? `(${order.discountCode})` : ''}</span>
                  <span>-{discountAmountNumber.toLocaleString('vi-VN')} đ</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-900">Tổng thanh toán</span>
                <span className="font-bold text-red-600 text-lg">
                  {totalAmountNumber.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">payments</span>
              Phương thức thanh toán
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Hình thức</span>
                <span className="text-xs font-bold text-slate-800">
                  {order.paymentMethod === 'COD' ? 'Tiền mặt khi nhận (COD)' : 'Chuyển khoản VietQR'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Trạng thái</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    order.paymentStatus === 'PAID'
                      ? 'bg-green-100 text-green-800'
                      : order.paymentStatus === 'FAILED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {order.paymentStatus === 'PAID'
                    ? 'Đã thanh toán'
                    : order.paymentStatus === 'FAILED'
                    ? 'Thất bại'
                    : 'Chờ thanh toán'}
                </span>
              </div>

              {/* QR Code section if QR and PENDING */}
              {order.paymentMethod === 'QR_CODE' && order.paymentStatus === 'PENDING' && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-600 mb-3">
                    Quét mã QR qua ngân hàng để hoàn tất:
                  </p>
                  <div className="relative w-44 h-44 mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <Image
                      src={qrCodeUrl}
                      alt={`Mã QR thanh toán cho đơn hàng ${order.code}`}
                      fill
                      className="object-contain"
                      sizes="176px"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 font-mono">
                    Nội dung CK: <strong className="text-slate-800">{order.code}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
