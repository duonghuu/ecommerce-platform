import React from 'react';

export interface OrderSummary {
  id: string;
  orderCode: string;
  totalAmount: number;
  status: 'PENDING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface OrderHistoryProps {
  orders: OrderSummary[];
  isLoading: boolean;
}

const statusMap = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-600' },
  SHIPPING: { label: 'Đang giao', color: 'bg-blue-100 text-blue-800', dot: 'bg-blue-600' },
  COMPLETED: { label: 'Thành công', color: 'bg-green-100 text-green-800', dot: 'bg-green-600' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', dot: 'bg-red-600' }
};

export default function OrderHistory({ orders, isLoading }: OrderHistoryProps) {
  return (
    <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-md shadow-[0_10px_15px_-3px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Lịch sử mua hàng</h2>
        <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-[12px] font-bold">
          {orders.length} đơn hàng gần nhất
        </span>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-surface-variant rounded"></div>
          <div className="h-12 bg-surface-variant rounded"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-surface-variant">
              <tr>
                <th className="py-4 px-2 font-label-md text-label-md text-on-surface-variant">MÃ ĐƠN</th>
                <th className="py-4 px-2 font-label-md text-label-md text-on-surface-variant">NGÀY</th>
                <th className="py-4 px-2 font-label-md text-label-md text-on-surface-variant">TỔNG CỘNG</th>
                <th className="py-4 px-2 font-label-md text-label-md text-on-surface-variant">TRẠNG THÁI</th>
                <th className="py-4 px-2 font-label-md text-label-md text-on-surface-variant"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant font-body-md">
                    Bạn chưa có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                orders.map(order => {
                  const statusConfig = statusMap[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                      <td className="py-4 px-2 font-body-md text-body-md text-primary font-bold">{order.orderCode}</td>
                      <td className="py-4 px-2 font-body-md text-body-md text-secondary">{order.createdAt}</td>
                      <td className="py-4 px-2 font-body-md text-body-md text-on-surface font-bold">
                        {order.totalAmount.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="py-4 px-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusConfig.color}`}>
                          <span className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-2`}></span>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button className="material-symbols-outlined text-secondary hover:text-primary transition-colors">chevron_right</button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {orders.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button className="text-secondary font-label-md text-label-md font-bold flex items-center gap-1 hover:text-primary transition-colors">
            Xem tất cả lịch sử đơn hàng
            <span className="material-symbols-outlined text-sm">arrow_downward</span>
          </button>
        </div>
      )}
    </section>
  );
}
