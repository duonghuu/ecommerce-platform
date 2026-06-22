'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFilter } from './ProductLayoutWrapper';

export interface ProductToolbarProps {
  totalItems: number;
}

export function ProductToolbar({ totalItems }: ProductToolbarProps) {
  const { isVisible, toggle } = useFilter();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'newest';

  const onSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortValue);
    params.delete('page');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-sm mb-md bg-white p-sm rounded-xl border border-slate-200">
      <div className="flex items-center gap-sm">
        <button
          onClick={toggle}
          className="flex items-center gap-xs text-slate-600 hover:text-slate-900 transition-colors font-body-md"
        >
          <span className="material-symbols-outlined text-lg">
            {isVisible ? 'filter_list_off' : 'filter_list'}
          </span>
          <span className="hidden sm:inline">Bộ lọc</span>
        </button>
        <span className="text-slate-400">|</span>
        <span className="text-slate-600 font-body-md">
          Hiển thị <strong className="text-slate-900">{totalItems}</strong> sản phẩm
        </span>
      </div>
      
      <div className="flex items-center gap-xs">
        <label htmlFor="sort" className="text-slate-600 font-body-md hidden sm:inline">Sắp xếp:</label>
        <select
          id="sort"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-slate-200 rounded-lg px-sm py-xs text-slate-900 font-body-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá: Thấp đến cao</option>
          <option value="price_desc">Giá: Cao đến thấp</option>
          <option value="popular">Nổi bật</option>
        </select>
      </div>
    </div>
  );
}
