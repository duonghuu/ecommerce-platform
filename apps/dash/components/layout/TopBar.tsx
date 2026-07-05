"use client";

import Image from "next/image";

export function TopBar() {
  return (
    <header className="h-[70px] bg-white flex items-center justify-between px-8 shrink-0 z-10 border-b border-gray-100">
      {/* Search */}
      <div className="flex items-center">
        <i className="fa-solid fa-bars text-xl text-dark opacity-70 cursor-pointer mr-6 hover:opacity-100 transition-opacity"></i>
        <div className="relative w-[388px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className="fa-solid fa-search text-gray-400"></i>
          </div>
          <input 
            type="text" 
            placeholder="Search" 
            className="block w-full pl-11 pr-4 py-2.5 bg-[#F5F6FA] border border-[#D5D5D5] rounded-full text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative text-dark opacity-70 hover:opacity-100 transition-opacity">
          <i className="fa-regular fa-bell text-xl"></i>
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
            6
          </span>
        </button>

        {/* Language */}
        <button className="flex items-center gap-2 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors">
          <Image src="https://flagcdn.com/w40/gb.png" alt="English" width={28} height={20} className="w-7 h-5 rounded object-cover shadow-sm" unoptimized />
          <span className="text-sm font-semibold text-[#646464]">English</span>
          <i className="fa-solid fa-chevron-down text-xs text-gray-400 ml-1"></i>
        </button>

        {/* Profile */}
        <button className="flex items-center gap-3 hover:bg-gray-50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-gray-100">
          <Image src="https://ui-avatars.com/api/?name=Moni+Roy&background=4880FF&color=fff" alt="Moni Roy" width={44} height={44} className="w-11 h-11 rounded-full object-cover" unoptimized />
          <div className="text-left hidden sm:block">
            <p className="text-[14px] font-bold text-[#404040] leading-tight">Moni Roy</p>
            <p className="text-[12px] font-semibold text-[#565656] leading-tight mt-0.5">Admin</p>
          </div>
          <i className="fa-solid fa-chevron-down text-xs text-gray-400 ml-2"></i>
        </button>
      </div>
    </header>
  );
}
