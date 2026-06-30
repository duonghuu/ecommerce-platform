"use client";

import React, { useState, useEffect } from 'react';
import MasterLayout from '@/components/layout/MasterLayout';
import ProfileInfo, { User } from '@/components/auth/ProfileInfo';
import OrderHistory, { OrderSummary } from '@/components/auth/OrderHistory';
import LogoutButton from '@/components/auth/LogoutButton';
import { logoutUser } from '@/app/actions/auth';

// Mock Data
const MOCK_USER: User = {
  id: 'usr_123',
  fullName: 'Hải Đăng',
  email: 'haidang.dev@gmail.com',
  phone: '0912345678',
  role: 'Senior Developer'
};

const MOCK_ORDERS: OrderSummary[] = [
  {
    id: 'ord_1',
    orderCode: 'TB-12345',
    totalAmount: 85000,
    status: 'SHIPPING',
    createdAt: '15/10/2023'
  },
  {
    id: 'ord_2',
    orderCode: 'TB-12300',
    totalAmount: 120000,
    status: 'COMPLETED',
    createdAt: '10/10/2023'
  }
];

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const fetchProfile = async () => {
      setIsFetchingProfile(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setUser(MOCK_USER);
      setOrders(MOCK_ORDERS);
      setIsFetchingProfile(false);
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <MasterLayout>
      <div className="flex-grow w-full mx-auto py-10 mt-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
          
          {/* Left Column: Sidebar Navigation */}
          <aside className="col-span-1 flex flex-col h-fit md:sticky md:top-24 mb-8 md:mb-0">
            <nav className="flex flex-col gap-2">
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-fixed text-on-primary-fixed font-bold border-l-4 border-primary transition-all">
                <span className="material-symbols-outlined">person</span>
                <span className="font-body-md text-body-md">Thông tin cá nhân</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:bg-surface-container transition-all">
                <span className="material-symbols-outlined">receipt_long</span>
                <span className="font-body-md text-body-md">Lịch sử mua hàng</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:bg-surface-container transition-all">
                <span className="material-symbols-outlined">settings</span>
                <span className="font-body-md text-body-md">Cài đặt</span>
              </a>
            </nav>
            
            <div className="mt-xl pt-lg border-t border-surface-variant">
              <LogoutButton onLogout={handleLogout} isLoading={isLoggingOut} />
            </div>
          </aside>
          
          {/* Right Column: Content Area */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-gutter">
            {isFetchingProfile || !user ? (
              <div className="animate-pulse space-y-8">
                <div className="h-64 bg-surface-container-low rounded-2xl"></div>
                <div className="h-64 bg-surface-container-low rounded-2xl"></div>
              </div>
            ) : (
              <>
                <ProfileInfo user={user} />
                <OrderHistory orders={orders} isLoading={isFetchingProfile} />
                
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
            )}
          </div>

        </div>
      </div>
    </MasterLayout>
  );
}
