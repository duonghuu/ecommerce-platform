"use client";

import React from 'react';

export interface LogoutButtonProps {
  onLogout: () => void;
  isLoading?: boolean;
}

export default function LogoutButton({ onLogout, isLoading }: LogoutButtonProps) {
  return (
    <button 
      onClick={onLogout}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-error/10 text-error font-bold hover:bg-error hover:text-on-error transition-all duration-200 disabled:opacity-70"
    >
      {isLoading ? (
        <span className="material-symbols-outlined animate-spin">progress_activity</span>
      ) : (
        <span className="material-symbols-outlined">logout</span>
      )}
      <span className="font-body-md text-body-md">Đăng xuất</span>
    </button>
  );
}
