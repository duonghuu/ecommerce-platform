import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Pagination } from '@/components/ui/Pagination';
import { getMyOrdersServer } from '@/app/actions/orders';
import { checkAuth } from '@/app/actions/auth';
import { statusMap } from '@/components/auth/OrderHistory';

export const metadata = {
  title: 'Lịch sử đơn hàng - TechBite Pro',
  description: 'Danh sách và trạng thái các đơn hàng đã đặt của bạn',
};

interface ProfileOrdersPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ProfileOrdersPage({ searchParams }: ProfileOrdersPageProps) {
  const isAuth = await checkAuth();
  if (!isAuth) {
    redirect('/login');
  }

  const resolvedSearchParams = await searchParams;
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1);
  const limit = 10;

  const ordersResult = await getMyOrdersServer(currentPage, limit);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-surface-variant">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lịch sử đơn hàng</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Theo dõi và quản lý tất cả đơn hàng đã mua tại TechBite
          </p>
        </div>
      </div>

      {/* Content handling "Kiềng 3 chân" */}
      {!ordersResult.success ? (
        <div className="bg-red-50 text-red-700 p-8 rounded-2xl border border-red-200 text-center my-4">
          <span className="material-symbols-outlined text-4xl mb-2 text-red-500">error</span>
          <h3 className="font-bold text-lg mb-1">Không thể tải danh sách đơn hàng</h3>
          <p className="text-sm text-red-600">{ordersResult.message || 'Đã có lỗi xảy ra từ hệ thống. Vui lòng thử lại sau.'}</p>
        </div>
      ) : !ordersResult.data || ordersResult.data.items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <span className="material-symbols-outlined text-5xl text-slate-400 mb-3">receipt_long</span>
          <h3 className="font-bold text-lg text-slate-800 mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            Bạn chưa có đơn đặt hàng nào trong tài khoản. Hãy bắt đầu chọn những món ăn vặt và nước uống thơm ngon nhé!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">shopping_cart</span>
            Khám phá thực đơn ngay
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-4 px-4">Mã đơn hàng</th>
                    <th className="py-4 px-4">Ngày đặt</th>
                    <th className="py-4 px-4">Sản phẩm</th>
                    <th className="py-4 px-4">Thanh toán</th>
                    <th className="py-4 px-4">Tổng tiền</th>
                    <th className="py-4 px-4">Trạng thái</th>
                    <th className="py-4 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {ordersResult.data.items.map((order) => {
                    const statusConfig = statusMap[order.status] || statusMap.PENDING;
                    const formattedDate = new Date(order.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const totalAmountNumber = Number(order.totalAmount) || 0;
                    const totalItemCount = order.items?.reduce((sum, it) => sum + it.quantity, 0) || order.items?.length || 0;

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 font-bold text-primary">
                          <Link href={`/profile/orders/${order.id}`} className="hover:underline">
                            {order.code}
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-slate-600 text-xs">{formattedDate}</td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-slate-800 line-clamp-1">
                              {order.items?.[0]?.productName || 'Sản phẩm TechBite'}
                            </span>
                            {totalItemCount > 1 && (
                              <span className="text-xs text-slate-500">
                                + {totalItemCount - 1} món khác ({totalItemCount} món)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1 text-xs">
                            <span className="font-semibold text-slate-700">
                              {order.paymentMethod === 'COD' ? 'Tiền mặt (COD)' : 'Chuyển khoản VietQR'}
                            </span>
                            <span
                              className={`inline-block w-fit text-[11px] px-2 py-0.5 rounded font-medium ${
                                order.paymentStatus === 'PAID'
                                  ? 'bg-green-50 text-green-700'
                                  : order.paymentStatus === 'FAILED'
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {order.paymentStatus === 'PAID'
                                ? 'Đã thanh toán'
                                : order.paymentStatus === 'FAILED'
                                ? 'Thất bại'
                                : 'Chờ thanh toán'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-bold text-red-600">
                          {totalAmountNumber.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-1.5`}></span>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link
                            href={`/profile/orders/${order.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Chi tiết
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="py-3 px-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Hiển thị {ordersResult.data.items.length} trên tổng số {ordersResult.data.pagination.total} đơn hàng
              </span>
              <span>
                Trang {ordersResult.data.pagination.page} / {ordersResult.data.pagination.totalPages}
              </span>
            </div>
          </div>

          {/* Pagination */}
          {ordersResult.data.pagination.totalPages > 1 && (
            <Pagination totalPages={ordersResult.data.pagination.totalPages} />
          )}
        </>
      )}
    </div>
  );
}
