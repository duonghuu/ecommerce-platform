"use client";

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
});

export type LoginPayload = z.infer<typeof loginSchema>;

export interface LoginFormProps {
  isLoading: boolean;
  errorMessage?: string;
  onSubmit: (data: LoginPayload) => void;
}

export default function LoginForm({ isLoading, errorMessage, onSubmit }: LoginFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema)
  });

  return (
    <div className="bg-surface-container-lowest border border-slate-200 rounded-2xl w-full max-w-[400px] p-lg flex flex-col gap-md mx-auto shadow-[0_10px_15px_-3px_rgba(15,23,42,0.05)] mt-8 mb-16">
      <div className="text-center space-y-xs">
        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">Chào mừng trở lại</h1>
        <p className="font-body-md text-body-md text-on-secondary-container">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-primary-container font-semibold hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>

      <form className="space-y-md mt-sm" onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 font-body-md">
            {errorMessage}
          </div>
        )}
        <div className="space-y-xs">
          <label htmlFor="email" className="block font-label-md text-label-md text-on-surface-variant">Email</label>
          <div className="relative">
            <input 
              type="email" 
              id="email" 
              {...register('email')}
              placeholder="coder@techbite.vn" 
              className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-lg px-md py-sm font-body-md text-body-md focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all peer`} 
            />
            <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-secondary-container opacity-40 peer-focus:text-primary-container peer-focus:opacity-100 transition-all">mail</span>
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1 font-body-md">{errors.email.message}</p>}
        </div>

        <div className="space-y-xs">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block font-label-md text-label-md text-on-surface-variant">Mật khẩu</label>
            <Link href="/forgot-password" className="text-label-md text-primary-container hover:underline">Quên mật khẩu?</Link>
          </div>
          <div className="relative">
            <input 
              type="password"
              id="password" 
              {...register('password')}
              placeholder="••••••••" 
              className={`w-full bg-white border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-lg px-md py-sm font-body-md text-body-md focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all peer`} 
            />
            <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-secondary-container opacity-40 peer-focus:text-primary-container peer-focus:opacity-100 transition-all">lock</span>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1 font-body-md">{errors.password.message}</p>}
        </div>

        <div className="flex items-center gap-xs">
          <input type="checkbox" id="remember" className="w-4 h-4 rounded text-primary-container border-slate-300 focus:ring-primary-container" />
          <label htmlFor="remember" className="font-body-md text-body-md text-on-surface-variant select-none">Ghi nhớ đăng nhập</label>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary-container text-white font-semibold py-sm rounded-xl hover:bg-primary transition-colors duration-200 active:scale-95 shadow-sm mt-xs disabled:opacity-70 flex justify-center items-center gap-2"
        >
          {isLoading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
          Đăng nhập
        </button>
      </form>

      {/* Social Login Divider */}
      <div className="relative flex items-center py-xs">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-xs font-label-md text-label-md text-on-secondary-container uppercase">Hoặc</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <div className="grid grid-cols-2 gap-sm">
        <button type="button" className="flex items-center justify-center gap-xs border border-slate-200 bg-white py-xs rounded-lg font-label-md text-on-surface hover:bg-slate-50 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
          Google
        </button>
        <button type="button" className="flex items-center justify-center gap-xs border border-slate-200 bg-white py-xs rounded-lg font-label-md text-on-surface hover:bg-slate-50 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.152-1.11-1.458-1.11-1.458-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path></svg>
          GitHub
        </button>
      </div>
    </div>
  );
}
