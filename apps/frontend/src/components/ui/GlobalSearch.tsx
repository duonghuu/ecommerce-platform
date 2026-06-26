"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface SuggestProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface SearchInputProps {
  keyword: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  isMobile?: boolean;
}

function SearchInput({ keyword, onChange, onFocus, isMobile }: SearchInputProps) {
  return (
    <div
      className={`flex items-center bg-surface-container-low px-sm py-xs rounded border border-surface-variant w-full focus-within:border-primary transition-all ${
        !isMobile ? "md:w-80 group" : "mb-xs"
      }`}
    >
      <span className="material-symbols-outlined text-secondary mr-xs">search</span>
      <input
        className="bg-transparent border-none focus:ring-0 font-body-md text-body-md w-full placeholder:text-secondary outline-none"
        placeholder="Tìm món ngon tiếp thêm code..."
        type="text"
        value={keyword}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
      />
    </div>
  );
}

interface SuggestProductItemProps {
  product: SuggestProduct;
  onClick: (productId: string) => void;
}

function SuggestProductItem({ product, onClick }: SuggestProductItemProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="flex items-center gap-sm p-sm hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
      onClick={() => onClick(product.id)}
    >
      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
        {product.image && (
          <Image
            alt={product.name}
            src={product.image}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate">{product.name}</p>
        <p className="text-sm font-bold text-[#A63D40]">
          {product.price.toLocaleString("vi-VN")}đ
        </p>
      </div>
    </Link>
  );
}

interface SearchSuggestDropdownProps {
  isOpen: boolean;
  isLoading: boolean;
  isError: boolean;
  products: SuggestProduct[];
  keyword: string;
  onClose: () => void;
}

function SearchSuggestDropdown({
  isOpen,
  isLoading,
  isError,
  products,
  keyword,
  onClose,
}: SearchSuggestDropdownProps) {
  if (!isOpen || !keyword) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
      <div className="flex flex-col">
        {isLoading ? (
          <div className="p-sm text-center text-sm text-secondary flex flex-col items-center gap-2">
            <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
            Đang tìm kiếm...
          </div>
        ) : isError ? (
          <div className="p-sm text-center text-sm text-[#A63D40] flex flex-col items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            Không tải được dữ liệu. Vui lòng thử lại.
          </div>
        ) : products.length > 0 ? (
          <>
            {products.map((product) => (
              <SuggestProductItem
                key={product.id}
                product={product}
                onClick={(id) => {
                  console.log("Navigating to product", id);
                  onClose();
                }}
              />
            ))}
            <button
              className="w-full p-3 text-center text-primary font-bold bg-orange-50/50 hover:bg-orange-50 transition-colors"
              onClick={() => {
                console.log("View all results for", keyword);
                onClose();
              }}
            >
              Xem tất cả kết quả
            </button>
          </>
        ) : (
          <div className="p-sm text-center text-sm text-secondary">
            Không tìm thấy kết quả.
          </div>
        )}
      </div>
    </div>
  );
}

export default function GlobalSearch({ isMobile = false }: { isMobile?: boolean }) {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Fetch data with React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["searchSuggest", debouncedKeyword],
    queryFn: async () => {
      if (!debouncedKeyword) return [];
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/suggest?keyword=${debouncedKeyword}`);
      return res.data.data as SuggestProduct[];
    },
    enabled: !!debouncedKeyword,
  });

  const suggestedProducts = data || [];
  // Use isFetching logic if you want continuous loading states when keyword changes but data is already cached
  // isLoading is true only on first fetch. For autocomplete, it's usually fine.

  return (
    <div className={`relative ${isMobile ? "w-full" : ""}`} ref={searchRef}>
      <SearchInput
        keyword={keyword}
        onChange={setKeyword}
        onFocus={() => setIsDropdownOpen(true)}
        isMobile={isMobile}
      />
      <SearchSuggestDropdown
        isOpen={isDropdownOpen}
        isLoading={isLoading}
        isError={isError}
        products={suggestedProducts}
        keyword={debouncedKeyword}
        onClose={() => setIsDropdownOpen(false)}
      />
    </div>
  );
}
