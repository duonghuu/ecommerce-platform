"use client";

import React from "react";
import Image from "next/image";
import QuantitySelector from "./QuantitySelector";
import { ICartItem } from "../../store/cartStore";

interface CartItemProps {
  item: ICartItem;
  onIncreaseQuantity: (id: string) => void;
  onDecreaseQuantity: (id: string) => void;
  onRemoveItem: (id: string) => void;
}

export default function CartItem({
  item,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
}: CartItemProps) {
  // Helper to format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="flex gap-sm py-sm border-b border-surface-variant bg-surface relative">
      {/* Thumbnail */}
      <div className="w-20 h-20 bg-gray-50 rounded border border-surface-variant shrink-0 relative overflow-hidden flex items-center justify-center">
        <Image
          src={item.thumbnailUrl}
          alt={item.name}
          width={80}
          height={80}
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col flex-grow justify-between pr-6">
        <div>
          <h3 className="font-body-md text-body-md text-on-surface line-clamp-2">
            {item.name}
          </h3>
          <p className="font-body-md text-body-md font-bold text-red-600 mt-1">
            {formatPrice(item.price)}
          </p>
        </div>

        <div className="mt-2 w-24">
          <QuantitySelector
            value={item.quantity}
            onIncrease={() => onIncreaseQuantity(item.id)}
            onDecrease={() => onDecreaseQuantity(item.id)}
          />
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemoveItem(item.id)}
        className="absolute top-sm right-0 text-secondary hover:text-red-500 transition-colors p-1"
        aria-label="Remove item"
      >
        <span className="material-symbols-outlined text-[20px]">delete</span>
      </button>
    </div>
  );
}
