"use client";
import React from "react";

export interface SocialProofBannerProps {
  title: string;
  description: string;
  benefits: string[];
}

export default function SocialProofBanner({
  title,
  description,
  benefits,
}: SocialProofBannerProps) {
  return (
    <section className="mt-xl bg-slate-900 text-white rounded-2xl p-xl flex flex-col lg:flex-row items-center justify-between gap-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="white" strokeWidth="0.5"></path>
          <path d="M0,60 Q25,10 50,60 T100,60" fill="none" stroke="white" strokeWidth="0.5"></path>
          <path d="M0,40 Q25,-10 50,40 T100,40" fill="none" stroke="white" strokeWidth="0.5"></path>
        </svg>
      </div>
      
      <div className="relative z-10 lg:w-1/2">
        <h2 className="font-headline-lg text-headline-lg mb-md">{title}</h2>
        <p className="text-slate-400 font-body-lg text-body-lg mb-lg">
          {description}
        </p>
        <div className="flex flex-wrap gap-md">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary-container">
                check_circle
              </span>
              <span className="font-label-md text-label-md text-slate-300">
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="relative z-10 w-full lg:w-auto bg-white/5 backdrop-blur-lg border border-white/10 p-md rounded-xl">
        <form className="flex flex-col md:flex-row gap-sm" onSubmit={(e) => e.preventDefault()}>
          <input
            className="bg-white/10 border border-white/20 text-white px-md py-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none min-w-[300px]"
            placeholder="Email công ty của bạn..."
            type="email"
          />
          <button className="bg-primary text-on-primary px-lg py-sm rounded-lg font-headline-sm text-headline-sm hover:bg-orange-600 transition-all whitespace-nowrap">
            Đăng ký ngay
          </button>
        </form>
        <p className="text-slate-500 text-[10px] mt-xs text-center">
          Bằng cách đăng ký, bạn đồng ý với Điều khoản của TechBite.
        </p>
      </div>
    </section>
  );
}
