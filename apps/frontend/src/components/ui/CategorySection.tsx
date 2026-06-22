"use client";
import React from "react";

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  countText: string;
  isHot?: boolean;
}

export interface CategoryItemProps {
  category: Category;
  onClick?: (slug: string) => void;
}

export function CategoryItem({ category, onClick }: CategoryItemProps) {
  return (
    <div
      onClick={() => onClick && onClick(category.slug)}
      className="group bg-white border border-slate-200 p-lg rounded-xl hover:border-primary transition-all cursor-pointer text-center relative overflow-hidden"
    >
      {category.isHot && (
        <div className="absolute top-2 right-2 bg-error text-white text-[10px] px-2 py-0.5 rounded-full">
          HOT
        </div>
      )}
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-md group-hover:bg-primary-container transition-colors">
        {category.icon.startsWith('http') ? (
          <img src={category.icon} alt={category.name} className="w-8 h-8 object-contain" />
        ) : (
          <span className="material-symbols-outlined text-4xl text-slate-600 group-hover:text-on-primary-container">
            {category.icon}
          </span>
        )}
      </div>
      <span className="font-headline-sm text-headline-sm block text-on-surface">
        {category.name}
      </span>
      <span className="font-label-md text-label-md text-secondary block mt-1">
        {category.countText || "Khám phá ngay"}
      </span>
    </div>
  );
}

export interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="mt-xl">
      <div className="flex items-end justify-between mb-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Danh mục nạp mana</h2>
          <p className="text-secondary font-body-md text-body-md">
            Chọn loại nguyên liệu phù hợp với stack của bạn.
          </p>
        </div>
        <button className="text-primary font-label-md text-label-md flex items-center gap-xs hover:underline">
          Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
