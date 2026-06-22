"use client";

import React from "react";

interface QuantitySelectorProps {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
}

export default function QuantitySelector({
  value,
  onIncrease,
  onDecrease,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-surface-variant rounded h-8">
      <button
        onClick={onDecrease}
        disabled={disabled || value <= 1}
        className="px-2 h-full text-secondary hover:bg-surface-container-low disabled:opacity-50 transition-colors flex items-center justify-center rounded-l"
        aria-label="Decrease quantity"
      >
        <span className="material-symbols-outlined text-[16px]">remove</span>
      </button>
      
      <span className="w-8 text-center font-label-md text-label-md text-on-surface">
        {value}
      </span>
      
      <button
        onClick={onIncrease}
        disabled={disabled}
        className="px-2 h-full text-secondary hover:bg-surface-container-low disabled:opacity-50 transition-colors flex items-center justify-center rounded-r"
        aria-label="Increase quantity"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
      </button>
    </div>
  );
}
