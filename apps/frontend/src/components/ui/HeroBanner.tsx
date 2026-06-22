"use client";
import React from "react";

export interface HeroBannerProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  onCtaClick: () => void;
}

export default function HeroBanner({
  title,
  subtitle,
  imageUrl,
  ctaText,
  onCtaClick,
}: HeroBannerProps) {
  return (
    <section className="mt-md rounded-xl overflow-hidden relative min-h-[520px] flex items-center group">
      <div className="absolute inset-0 z-0 bg-neutral-900">
        <img
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
          alt="Banner Image"
          src={imageUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
      </div>
      <div className="relative z-10 px-md md:pl-xl max-w-2xl py-lg md:py-0">
        <div className="inline-block bg-primary-container px-sm py-1 rounded text-on-primary-container font-label-md text-label-md mb-md">
          #TECHBITEPOWERUP
        </div>
        <h1
          className="font-headline-xl text-headline-xl text-white mb-md leading-tight"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="text-white/80 font-body-lg text-body-lg mb-lg ">
          {subtitle}
        </p>
        <div className="flex items-center gap-md">
          <button
            onClick={onCtaClick}
            className="bg-primary text-on-primary px-lg py-sm rounded-lg font-headline-sm text-headline-sm hover:bg-orange-600 transition-all active:scale-95"
          >
            {ctaText}
          </button>
          <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-lg py-sm rounded-lg font-headline-sm text-headline-sm hover:bg-white/20 transition-all">
            Xem thực đơn
          </button>
        </div>
      </div>
    </section>
  );
}
