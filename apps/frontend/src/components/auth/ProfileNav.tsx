'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProfileNav() {
  const pathname = usePathname();
  const isOrders = pathname.startsWith('/profile/orders') || pathname.startsWith('/orders');
  const isProfile = pathname === '/profile';

  return (
    <nav className="flex flex-col gap-2">
      <Link
        href="/profile"
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isProfile
            ? 'bg-primary-fixed text-on-primary-fixed font-bold border-l-4 border-primary shadow-sm'
            : 'text-secondary hover:bg-surface-container'
        }`}
      >
        <span className="material-symbols-outlined">person</span>
        <span className="font-body-md text-body-md">Thông tin cá nhân</span>
      </Link>

      <Link
        href="/profile/orders"
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isOrders
            ? 'bg-primary-fixed text-on-primary-fixed font-bold border-l-4 border-primary shadow-sm'
            : 'text-secondary hover:bg-surface-container'
        }`}
      >
        <span className="material-symbols-outlined">receipt_long</span>
        <span className="font-body-md text-body-md">Lịch sử mua hàng</span>
      </Link>

      <Link
        href="/profile#change-password"
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:bg-surface-container transition-all"
      >
        <span className="material-symbols-outlined">settings</span>
        <span className="font-body-md text-body-md">Đổi mật khẩu</span>
      </Link>
    </nav>
  );
}
