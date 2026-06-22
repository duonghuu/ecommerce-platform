import React from 'react';

export function Banner() {
  return (
    <div className="w-full bg-slate-900 text-white rounded-xl overflow-hidden relative min-h-[200px] md:min-h-[240px] flex items-center mb-lg">
      <div className="z-10 p-md md:p-xl max-w-2xl">
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg mb-sm">
          Giảm đến 50% cho các đơn hàng Tech Gear
        </h2>
        <p className="text-body-lg font-body-lg text-slate-300">
          Kết hợp thực đơn TechBite Pro để nhận ưu đãi đặc biệt.
        </p>
      </div>
      <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-orange-600/20 to-transparent pointer-events-none"></div>
    </div>
  );
}
