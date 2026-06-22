import React from 'react';
import { ProductToolbar } from './ProductToolbar';
import { ProductGrid } from './ProductGrid';
import { Pagination } from '@/components/ui/Pagination';

export interface ProductMainAreaProps {
  products: any[];
  pagination: any;
  totalItems: number;
}

export function ProductMainArea({ products, pagination, totalItems }: ProductMainAreaProps) {
  return (
    <div className="flex-grow flex flex-col min-w-0">
      <ProductToolbar totalItems={totalItems} />
      <ProductGrid products={products} />
      {pagination.totalPages > 1 && (
        <Pagination totalPages={pagination.totalPages} />
      )}
    </div>
  );
}
