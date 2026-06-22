import React from 'react';

export interface BannerProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export function Banner({ title, subtitle, imageUrl }: BannerProps) {
  if (!title) return null;
  
  return (
    <div 
      className="w-full bg-slate-900 text-white rounded-xl overflow-hidden relative min-h-[200px] md:min-h-[240px] flex items-center mb-lg bg-cover bg-center"
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}}
    >
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div className="z-10 p-md md:p-xl max-w-2xl relative">
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg mb-sm">
          {title}
        </h2>
        {subtitle && (
          <p className="text-body-lg font-body-lg text-slate-200">
            {subtitle}
          </p>
        )}
      </div>
      <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-orange-600/20 to-transparent pointer-events-none z-10"></div>
    </div>
  );
}
