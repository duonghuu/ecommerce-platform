'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductToolbar } from './ProductToolbar';
import { ProductGrid } from './ProductGrid';
import { Pagination } from '@/components/ui/Pagination';
import { Product } from '@/components/ui/ProductCard';
import { useCartStore } from '@/store/cartStore';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Cơm Tấm Sườn Bì Chả',
    price: 45000,
    description: 'Cay nhẹ, giòn rụm, cứu tinh đêm code.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLOdLprwLFM2xAwsPdSJUakEWSZXuuOgvtGnYYIwniE5Z34SYekMMSehDGr0qLUlKNQ90i4BK_kHUAJMK1Um0Gx8cM5BP_o0zedz0ewXW8Vxv_YRXP0_liM6k8UcE3dxqxpHlrpPJ0fLtknUpG0sNAEwEp-RHuWj4mqQZQNlNOYwmCamYgYcuzV8vLDW1NAAzfKGFLJXERQegJU9EbP3zJTSRMyENXST7u0cxVDrJLFTZceCpxPYZyecbj6ufcystCSZYzr4nPYlwa',
    badges: ['Bán chạy']
  },
  {
    id: 'p2',
    name: 'Bún Bò Huế Đặc Biệt',
    price: 55000,
    description: 'Đậm đà, cay nồng, tiếp thêm mana.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDitx6Hs5F69crbqgAAChw4XYMefzXDgkfExGWGX95MJGjj6Qjrtcgs46GxQtHmiVK6AjvZGDte4pCSkKCLFmYPY5Ldw5eWiYvtc1KqI_T_w0Ot0TS-jmLToUQmSWBReeaGMpTetJ0xgNUxVJQH8-5pDUjhhOayKg_LKPD6-efknO5R796jgJMKOoP2Y0yWpYNC4QngwLEJrow763grSitpv_qXdv2e-aqC33SlOEfgsETeIQx-zU6mriLQfCAdw0Z9lIcEI8qvdeoy',
    badges: ['Mới']
  },
  {
    id: 'p3',
    name: 'Trà Đào Cam Sả',
    price: 35000,
    description: 'Tỉnh táo, thanh mát cho giờ làm việc.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkR7mVuDw5ELOfeHR5cOI5wUTLPVH14AzC_25MksfPCheyMJy2KKxEjnu3d1yODcdfmAVteDZqyLQi9Z59Tz6A9rpKXG0vQiUOtiY-9r-nwzl773SPJdmrIxHI7qXqk4O6zqM6-SSK6o5ohkmwv4L5vEt4qWtXO42s0LH3-rG14408szlraaLuRV3L4k6fIiVu1j2MsEItBaJJv56UbuHQmpVt3qjboZq2b-1cEWwI5NLpGUGDJvRCjE4KOOcRD7sQ7c51SMEvDAl3',
  },
  {
    id: 'p4',
    name: 'Gà Rán Xốt Cay',
    price: 85000,
    description: 'Giòn tan, đậm vị, bùng nổ năng lượng.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPo5RRkgvBTNqg0cUfFAzAtHF9w2TeFE0flFmAc9MGTiykMKGHTKhIJBxnd8JlI8o_wSBGIj0QmqgCs72pbz2PV8IsQJb6T627yfa6Lknt-I62rDjzeElaJOFCuQmuz7IBLY3AE1mRn-JWQS04N732MeScT-n5q68K-GF9Air3E1iafMLV21xsImrb05fCTaFe83XNRSG5bnvWrqpZfEFOoczGQrXI8XAEbxytY8bkqHZ2Me0b_CpD-_f8BxspiovPFGE07EC7BvLT',
    badges: ['Giảm 15%']
  }
];

export interface ProductMainAreaProps {
  isFilterVisible: boolean;
  onToggleFilter: () => void;
}

export function ProductMainArea({ isFilterVisible, onToggleFilter }: ProductMainAreaProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);
  
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = Number(searchParams.get('page')) || 1;

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortValue);
    params.delete('page');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (productId: string) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        thumbnailUrl: product.imageUrl,
      });
      // Toast notification logic could go here
    }
  };

  return (
    <div className="flex-grow flex flex-col min-w-0">
      <ProductToolbar
        totalItems={MOCK_PRODUCTS.length}
        isFilterVisible={isFilterVisible}
        currentSort={currentSort}
        onToggleFilter={onToggleFilter}
        onSortChange={handleSortChange}
      />
      <ProductGrid products={MOCK_PRODUCTS} onAddToCart={handleAddToCart} />
      <Pagination
        currentPage={currentPage}
        totalPages={3}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
