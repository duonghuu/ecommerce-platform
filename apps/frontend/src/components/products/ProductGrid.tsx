import React from 'react';
import { ProductCard, Product } from '@/components/ui/ProductCard';

export interface ProductGridProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="w-full py-xl flex flex-col items-center justify-center text-slate-500">
        <span className="material-symbols-outlined text-4xl mb-sm">search_off</span>
        <p className="font-body-md">Không tìm thấy sản phẩm nào phù hợp.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
