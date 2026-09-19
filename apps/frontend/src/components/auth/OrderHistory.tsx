import React from 'react';
import Link from 'next/link';
import { OrderDetail, OrderStatusType } from '@/app/actions/orders';

export interface OrderHistoryProps {
  orders: OrderDetail[];
  isLoading?: boolean;
  errorMessage?: string;
}

export const statusMap: Record<OrderStatusType, { label: string; color: string; dot: string }> = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-800 border border-amber-200', dot: 'bg-amber-500' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800 border border-blue-200', dot: 'bg-blue-500' },
  SHIPPING: { label: 'Đang giao', color: 'bg-indigo-100 text-indigo-800 border border-indigo-200', dot: 'bg-indigo-500' },
  COMPLETED: { label: 'Hoàn tất', color: 'bg-emerald-100 text-emerald-800 border border-emerald-200', dot: 'bg-emerald-500' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-rose-100 text-rose-800 border border-rose-200', dot: 'bg-rose-500' },
};

export default function OrderHistory({ orders, isLoading = false, errorMessage }: OrderHistoryProps) {
  if (errorMessage) {
    return (
      <section className="bg-surface-container-lowest rounded-2xl border border-red-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Lịch sử mua hàng</h2>
        </div>
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
          <p className="font-body-md">{errorMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Lịch sử mua hàng</h2>
          <p className="font-body-sm text-secondary text-sm">5 đơn hàng gần nhất của bạn</p>
        </div>
        <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-[12px] font-bold">
          {orders.length} đơn hàng
        </span>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-surface-variant rounded-xl"></div>
          <div className="h-12 bg-surface-variant rounded-xl"></div>
          <div className="h-12 bg-surface-variant rounded-xl"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">shopping_bag</span>
          <p className="text-on-surface-variant font-body-md font-medium">Bạn chưa có đơn hàng nào.</p>
          <Link
            href="/products"
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            Khám phá món ngon
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-surface-variant text-xs text-on-surface-variant uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 font-semibold">Mã đơn</th>
                <th className="py-3 px-3 font-semibold">Ngày đặt</th>
                <th className="py-3 px-3 font-semibold">Số món</th>
                <th className="py-3 px-3 font-semibold">Tổng cộng</th>
                <th className="py-3 px-3 font-semibold">Trạng thái</th>
                <th className="py-3 px-3 text-right font-semibold">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {orders.map((order) => {
                const statusConfig = statusMap[order.status] || statusMap.PENDING;
                const formattedDate = new Date(order.createdAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                });
                const totalAmountNumber = Number(order.totalAmount) || 0;
                const totalItemQuantity = order.items?.reduce((sum, it) => sum + it.quantity, 0) || order.items?.length || 0;

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-container-low transition-colors group"
                  >
                    <td className="py-4 px-3 font-body-md text-primary font-bold">
                      <Link href={`/profile/orders/${order.id}`} className="hover:underline">
                        {order.code}
                      </Link>
                    </td>
                    <td className="py-4 px-3 font-body-md text-secondary text-sm">{formattedDate}</td>
                    <td className="py-4 px-3 font-body-md text-slate-600 text-sm">
                      {totalItemQuantity} món
                    </td>
                    <td className="py-4 px-3 font-body-md text-red-600 font-bold">
                      {totalAmountNumber.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="py-4 px-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-1.5`}></span>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <Link
                        href={`/profile/orders/${order.id}`}
                        className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-primary transition-colors group-hover:translate-x-1 duration-150"
                      >
                        Xem
                        <span className="material-symbols-outlined text-base ml-0.5">chevron_right</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {orders.length > 0 && (
        <div className="mt-6 flex justify-center pt-4 border-t border-surface-variant">
          <Link
            href="/profile/orders"
            className="text-secondary font-label-md text-label-md font-bold flex items-center gap-1.5 hover:text-primary transition-colors py-2 px-4 rounded-xl hover:bg-surface-container"
          >
            Xem tất cả lịch sử đơn hàng
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      )}
    </section>
  );
}
