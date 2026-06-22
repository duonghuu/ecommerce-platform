import React, { Suspense } from 'react';
import MasterLayout from '@/components/layout/MasterLayout';
import { Banner } from '@/components/products/Banner';
import { ProductListLayout } from '@/components/products/ProductListLayout';

export const metadata = {
  title: 'Thực đơn - TechBite Pro',
  description: 'Khám phá thực đơn đặc biệt dành riêng cho dân IT',
};

export default function ProductListPage() {
  return (
    <MasterLayout>
      <div className="pt-8">
        <Banner />
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Đang tải dữ liệu...</div>}>
          <ProductListLayout />
        </Suspense>
      </div>
    </MasterLayout>
  );
}
