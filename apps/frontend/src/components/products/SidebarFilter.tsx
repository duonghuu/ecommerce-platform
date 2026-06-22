'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterGroup } from './FilterGroup';

const CATEGORY_OPTIONS = [
  { label: 'Đồ ăn chính', value: 'main', count: 120 },
  { label: 'Đồ ăn vặt', value: 'snack', count: 45 },
  { label: 'Thức uống', value: 'drink', count: 80 },
  { label: 'Tráng miệng', value: 'dessert', count: 25 },
];

const PRICE_OPTIONS = [
  { label: 'Dưới 50.000đ', value: 'under_50k' },
  { label: '50.000đ - 100.000đ', value: '50k_to_100k' },
  { label: 'Trên 100.000đ', value: 'over_100k' },
];

export function SidebarFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const category = searchParams.get('category') || '';
  const price = searchParams.get('price') || '';

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete('page'); // Reset to page 1
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white p-md rounded-xl border border-slate-200 h-fit">
      <FilterGroup
        title="Danh mục món"
        options={CATEGORY_OPTIONS}
        selectedValue={category}
        onChange={(val) => handleFilterChange('category', val)}
      />
      <hr className="border-slate-200 my-md" />
      <FilterGroup
        title="Mức giá"
        options={PRICE_OPTIONS}
        selectedValue={price}
        onChange={(val) => handleFilterChange('price', val)}
      />
    </aside>
  );
}
