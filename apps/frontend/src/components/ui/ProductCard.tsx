"use client";
import React from "react";
import { useCartStore } from '@/store/cartStore';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  badges?: string[];
  description: string;
}

export interface ProductCardProps {
  product: Product;
  isAddingToCart?: boolean;
}

export function ProductCard({ product, isAddingToCart }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      thumbnailUrl: product.imageUrl,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full">
      <div className="h-48 overflow-hidden relative">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 bg-slate-50"
          alt={product.name}
          src={product.imageUrl}
        />
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-xs left-xs bg-white/90 backdrop-blur px-xs py-1 rounded font-label-md text-label-md text-primary">
            {product.badges[0]}
          </div>
        )}
      </div>
      <div className="p-sm flex flex-col flex-grow">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">
          {product.name}
        </h3>
        <p className="text-secondary font-body-md text-body-md line-clamp-1 mb-md flex-grow">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-slate-900 font-headline-sm text-headline-sm">
            {product.price.toLocaleString("vi-VN")}đ
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="bg-slate-900 text-white w-10 h-10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors active:scale-90 disabled:opacity-50"
          >
            <span className="material-symbols-outlined">
              {isAddingToCart ? "hourglass_empty" : "add"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
