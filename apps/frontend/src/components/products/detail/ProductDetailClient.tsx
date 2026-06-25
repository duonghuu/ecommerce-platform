"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { ProductCard } from '@/components/ui/ProductCard';

interface ProductDetailProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fallback if images array is empty or null
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnailUrl];

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice ? Number(product.salePrice) : Number(product.price),
      quantity: quantity,
      thumbnailUrl: product.thumbnailUrl,
    });
    // Có thể thêm toast notification ở đây
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Chuyển hướng tới trang thanh toán (nếu có)
  };

  const currentPrice = product.salePrice ? Number(product.salePrice) : Number(product.price);
  const originalPrice = product.salePrice ? Number(product.price) : null;
  const discountPercent = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Top Section: Gallery and Product Info */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-12">
        {/* Gallery (Left) */}
        <div className="w-full md:w-1/2 flex-shrink-0 flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-2xl group w-full aspect-square border border-slate-100 bg-slate-50">
            <Image
              src={images[activeImageIndex]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.badgeText && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded font-label-md text-label-md text-primary">
                {product.badgeText}
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative min-w-[80px] h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    idx === activeImageIndex ? 'border-[#ff8c42] opacity-100' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${product.name} thumbnail ${idx}`} fill className="object-cover bg-slate-50" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info (Right) */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <nav className="flex text-secondary font-label-md gap-2 items-center text-sm">
              <Link href="/" className="hover:text-primary">Trang chủ</Link>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <Link href="/products" className="hover:text-primary">Thực đơn</Link>
              {product.category && (
                <>
                  <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                  <Link href={`/products?category=${product.category.id}`} className="hover:text-primary">{product.category.name}</Link>
                </>
              )}
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-on-surface line-clamp-1">{product.name}</span>
            </nav>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-headline-xl font-bold text-gray-900 tracking-tight mt-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center text-primary-container">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined">star_half</span>
              </div>
              <span className="text-secondary font-body-md text-sm">({product.salesCount || 0} đã bán)</span>
            </div>
          </div>

          <div className="flex items-end gap-3 py-4 border-y border-surface-variant">
            <span className="text-[#A63D40] text-3xl md:text-4xl font-bold">
              {currentPrice.toLocaleString('vi-VN')}đ
            </span>
            {originalPrice && (
              <>
                <span className="text-gray-400 line-through text-lg mb-1">
                  {originalPrice.toLocaleString('vi-VN')}đ
                </span>
                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs mb-1 font-bold">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-base text-gray-600 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="font-medium text-sm text-on-surface">Số lượng:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-white">
                  <button onClick={handleDecrement} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded transition-colors text-xl font-medium">-</button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button onClick={handleIncrement} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded transition-colors text-xl font-medium">+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 h-14 bg-[#ff8c42] text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md text-lg"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              Thêm vào giỏ
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 h-14 bg-white border-2 border-[#ff8c42] text-[#ff8c42] rounded-xl font-bold hover:bg-orange-50 transition-all active:scale-95 flex items-center justify-center text-lg"
            >
              Mua ngay
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
              <span className="material-symbols-outlined text-[#ff8c42]">delivery_dining</span>
              <div className="flex flex-col">
                <span className="font-bold text-sm">Giao hàng nhanh</span>
                <span className="text-[11px] text-secondary">Trong 30 phút</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
              <span className="material-symbols-outlined text-[#ff8c42]">verified</span>
              <div className="flex flex-col">
                <span className="font-bold text-sm">Đảm bảo tươi ngon</span>
                <span className="text-[11px] text-secondary">Nguyên liệu chuẩn</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Tabs/Description */}
      <div className="flex flex-col gap-12 mt-12">
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex border-b border-slate-100 mb-6 overflow-x-auto scrollbar-hide">
            <button className="px-6 py-3 border-b-2 border-[#ff8c42] font-bold text-[#ff8c42] whitespace-nowrap">Mô tả sản phẩm</button>
            <button className="px-6 py-3 text-secondary hover:text-on-surface whitespace-nowrap font-medium text-sm">Thành phần dinh dưỡng</button>
            <button className="px-6 py-3 text-secondary hover:text-on-surface whitespace-nowrap font-medium text-sm">Đánh giá khách hàng</button>
          </div>
          <div className="prose max-w-none text-gray-600 flex flex-col gap-4 text-base leading-relaxed">
            {product.description ? (
              <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }} />
            ) : (
              <p>Món ăn đang được cập nhật thông tin chi tiết.</p>
            )}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                Sản phẩm liên quan
                <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedItem) => (
                <ProductCard 
                  key={relatedItem.id} 
                  product={{
                    id: relatedItem.id,
                    name: relatedItem.name,
                    price: Number(relatedItem.price),
                    originalPrice: relatedItem.salePrice ? Number(relatedItem.price) : undefined,
                    imageUrl: relatedItem.thumbnailUrl,
                    badges: relatedItem.badgeText ? [relatedItem.badgeText] : undefined,
                    description: relatedItem.shortDescription || "",
                  }} 
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
