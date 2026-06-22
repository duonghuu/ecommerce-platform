"use client";
import React from "react";
import { Product, ProductCard } from "./ProductCard";

export interface FeaturedMenuProps {
  products: Product[];
}

export default function FeaturedMenu({ products }: FeaturedMenuProps) {
  return (
    <section className="mt-xl">
      <div className="flex items-center justify-between mb-lg">
        <h2 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-sm">
          Món ngon đang trending
          <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
        </h2>
        <div className="flex gap-xs">
          <button className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
