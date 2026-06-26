"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";
import GlobalSearch from "../ui/GlobalSearch";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-surface sticky top-0 z-50 border-b border-surface-variant transition-all duration-300 ${
        isScrolled ? "shadow-md h-16" : "h-20"
      }`}
    >
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto h-full">
        {/* Brand & Mobile Toggle */}
        <div className="flex items-center gap-sm md:gap-md">
          <button 
            className="lg:hidden text-on-surface p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
          
          <Link href="/">
            <span className="font-headline-md text-headline-md font-bold text-primary">
              TechBite Pro
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:block">
            <GlobalSearch />
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-md">
          <Link href="#" className="text-primary border-b-2 border-primary pb-1 font-label-md text-label-md">
            Menu
          </Link>
          <Link href="#" className="text-secondary hover:text-primary transition-colors font-label-md text-label-md">
            Catering
          </Link>
          <Link href="#" className="text-secondary hover:text-primary transition-colors font-label-md text-label-md">
            Rewards
          </Link>
          <Link href="#" className="text-secondary hover:text-primary transition-colors font-label-md text-label-md">
            Orders
          </Link>
          <Link href="#" className="text-secondary hover:text-primary transition-colors font-label-md text-label-md">
            Tech Gear
          </Link>
          <Link href="#" className="text-secondary hover:text-primary transition-colors font-label-md text-label-md">
            Support
          </Link>
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center gap-sm md:gap-md">
          <Link href="?cart=open" scroll={false} className="flex items-center gap-xs text-secondary hover:text-primary transition-all active:scale-95 relative">
            <span className="material-symbols-outlined" data-icon="shopping_cart">
              shopping_cart
            </span>
            {totalItems > 0 && (
              <span className="absolute -top-2 left-3 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
            <span className="font-label-md text-label-md hidden md:inline ml-1">Cart</span>
          </Link>
          <button className="flex items-center gap-xs bg-primary text-on-primary px-sm md:px-md py-xs rounded font-label-md text-label-md hover:bg-surface-tint transition-all active:scale-95">
            <span className="material-symbols-outlined" data-icon="account_circle">
              account_circle
            </span>
            <span className="hidden md:inline">Sign In</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-surface border-b border-surface-variant shadow-lg py-sm px-margin-mobile flex flex-col gap-sm">
          {/* Mobile Search */}
          <div className="flex md:hidden w-full mb-xs">
            <GlobalSearch isMobile={true} />
          </div>
          <Link href="#" className="text-primary font-label-md text-label-md py-xs border-b border-surface-variant">
            Menu
          </Link>
          <Link href="#" className="text-secondary hover:text-primary transition-colors font-label-md text-label-md py-xs border-b border-surface-variant">
            Catering
          </Link>
          <Link href="#" className="text-secondary hover:text-primary transition-colors font-label-md text-label-md py-xs border-b border-surface-variant">
            Rewards
          </Link>
          <Link href="#" className="text-secondary hover:text-primary transition-colors font-label-md text-label-md py-xs border-b border-surface-variant">
            Orders
          </Link>
          <Link href="#" className="text-secondary hover:text-primary transition-colors font-label-md text-label-md py-xs border-b border-surface-variant">
            Tech Gear
          </Link>
          <Link href="#" className="text-secondary hover:text-primary transition-colors font-label-md text-label-md py-xs">
            Support
          </Link>
        </div>
      )}
    </nav>
  );
}
