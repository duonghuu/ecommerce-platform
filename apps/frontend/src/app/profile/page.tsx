import React from 'react';
import ProfileInfo from '@/components/auth/ProfileInfo';
import OrderHistory from '@/components/auth/OrderHistory';
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';
import { getProfileUser } from '@/app/actions/auth';
import { getMyOrdersServer } from '@/app/actions/orders';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const profileResult = await getProfileUser();

  if (!profileResult.success || !profileResult.data) {
    redirect('/login');
  }

  const user = profileResult.data;

  // Lấy 5 đơn hàng mới nhất từ database
  const ordersResult = await getMyOrdersServer(1, 5);
  const recentOrders = ordersResult.success && ordersResult.data?.items ? ordersResult.data.items : [];
  const ordersError = !ordersResult.success ? ordersResult.message : undefined;

  return (
    <>
      <ProfileInfo user={user} />
      
      <div id="change-password">
        <ChangePasswordForm />
      </div>

      <OrderHistory orders={recentOrders} isLoading={false} errorMessage={ordersError} />
      
      {/* Additional Quick Actions (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="bg-tertiary-container/10 p-md rounded-2xl border border-tertiary-container/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-tertiary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-white">credit_card</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-tertiary-container">Phương thức thanh toán</h3>
            <p className="font-body-md text-body-md text-on-tertiary-fixed-variant">Quản lý thẻ tín dụng & Ví điện tử</p>
          </div>
        </div>
        
        <div className="bg-primary-container/10 p-md rounded-2xl border border-primary-container/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-white">location_on</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-primary-container">Địa chỉ giao hàng</h3>
            <p className="font-body-md text-body-md text-on-primary-fixed-variant">3 địa chỉ đã lưu</p>
          </div>
        </div>
      </div>
    </>
  );
}
