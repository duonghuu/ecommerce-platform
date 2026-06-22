"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCartStore } from "../../store/cartStore";
import CartItem from "./CartItem";

export default function CartDrawer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const isCartOpen = searchParams.get("cart") === "open";
  const { cartItems, increaseQuantity, decreaseQuantity, removeItem, getSubtotal } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  const handleClose = () => {
    // Navigate back to the same path without the cart param
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    currentParams.delete("cart");
    const query = currentParams.toString();
    const targetUrl = query ? `${pathname}?${query}` : pathname;
    router.push(targetUrl, { scroll: false });
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false);
      alert("Đã chuyển đến trang thanh toán!");
      handleClose();
    }, 1500);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const subtotal = getSubtotal();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-surface shadow-2xl z-[101] flex flex-col transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-md border-b border-surface-variant shrink-0">
          <h2 id="cart-title" className="font-headline-md text-headline-md text-on-surface">
            Giỏ hàng của bạn ({cartItems.length})
          </h2>
          <button 
            onClick={handleClose}
            className="text-secondary hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-container-low"
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-md flex flex-col gap-sm">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-secondary gap-sm">
              <span className="material-symbols-outlined text-[48px]">shopping_cart</span>
              <p className="font-body-md text-body-md">Giỏ hàng của bạn đang trống</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncreaseQuantity={increaseQuantity}
                onDecreaseQuantity={decreaseQuantity}
                onRemoveItem={removeItem}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-surface-variant p-md bg-surface shrink-0">
            <div className="flex justify-between items-center mb-md">
              <span className="font-body-lg text-body-lg text-on-surface">Tổng cộng</span>
              <span className="font-headline-sm text-headline-sm text-red-600 font-bold">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="font-label-md text-label-md text-secondary mb-md text-center">
              Thuế VAT đã được bao gồm trong giá
            </p>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-primary text-on-primary py-3 rounded font-label-md text-label-md hover:bg-surface-tint transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {isCheckingOut ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>Thanh Toán Ngay</span>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
