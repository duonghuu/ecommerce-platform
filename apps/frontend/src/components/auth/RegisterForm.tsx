"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const registerSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được để trống'),
  phone: z.string().min(1, 'Số điện thoại không được để trống').regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword']
});

export type RegisterFormPayload = z.infer<typeof registerSchema>;

export interface RegisterFormProps {
  isLoading: boolean;
  errorMessage?: string;
  onSubmit: (data: RegisterFormPayload) => void;
}

export default function RegisterForm({ isLoading, errorMessage, onSubmit }: RegisterFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormPayload>({
    resolver: zodResolver(registerSchema)
  });
  
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="w-full max-w-[400px] mx-auto mt-8 mb-16">
      <div className="bg-white rounded-2xl border border-slate-200 p-md md:p-lg shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        <div className="text-center mb-md">
          <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-xs">Tạo tài khoản mới</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-primary-container font-semibold hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>

        <form className="space-y-sm" onSubmit={handleSubmit(onSubmit)}>
          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 font-body-md">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-xs">
            <label htmlFor="fullName" className="font-label-md text-label-md text-on-surface-variant">Họ tên</label>
            <input 
              type="text" 
              id="fullName" 
              {...register('fullName')}
              placeholder="Nguyen Van A" 
              className={`w-full px-sm py-xs bg-white border ${errors.fullName ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all font-body-md text-body-md`}
            />
            {errors.fullName && <p className="text-red-500 text-xs font-body-md">{errors.fullName.message}</p>}
          </div>

          <div className="flex flex-col gap-xs">
            <label htmlFor="phone" className="font-label-md text-label-md text-on-surface-variant">Số điện thoại</label>
            <input 
              type="tel" 
              id="phone" 
              {...register('phone')}
              placeholder="0987654321" 
              className={`w-full px-sm py-xs bg-white border ${errors.phone ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all font-body-md text-body-md`}
            />
            {errors.phone && <p className="text-red-500 text-xs font-body-md">{errors.phone.message}</p>}
          </div>

          <div className="flex flex-col gap-xs">
            <label htmlFor="email" className="font-label-md text-label-md text-on-surface-variant">Email</label>
            <input 
              type="email" 
              id="email" 
              {...register('email')}
              placeholder="coder@techbite.vn" 
              className={`w-full px-sm py-xs bg-white border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all font-body-md text-body-md`}
            />
            {errors.email && <p className="text-red-500 text-xs font-body-md">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-xs">
            <label htmlFor="password" className="font-label-md text-label-md text-on-surface-variant">Mật khẩu</label>
            <div className="relative">
              <input 
                type={passwordVisible ? "text" : "password"} 
                id="password" 
                {...register('password')}
                placeholder="••••••••" 
                className={`w-full px-sm py-xs bg-white border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all font-body-md text-body-md pr-10`}
              />
              <button 
                type="button"
                tabIndex={-1}
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-all focus:outline-none"
              >
                <span className="material-symbols-outlined text-[20px]">{passwordVisible ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs font-body-md">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col gap-xs">
            <label htmlFor="confirmPassword" className="font-label-md text-label-md text-on-surface-variant">Xác nhận mật khẩu</label>
            <input 
              type="password" 
              id="confirmPassword" 
              {...register('confirmPassword')}
              placeholder="••••••••" 
              className={`w-full px-sm py-xs bg-white border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container outline-none transition-all font-body-md text-body-md`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs font-body-md">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-sm">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary-container text-white font-headline-sm text-headline-sm font-bold py-sm rounded-xl hover:bg-primary transition-colors shadow-md active:scale-[0.98] transform duration-150 disabled:opacity-70"
            >
              {isLoading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
              Đăng ký
            </button>
          </div>
          
          <p className="text-center font-label-md text-label-md text-on-surface-variant px-sm leading-relaxed mt-md">
            Bằng cách nhấp vào Đăng ký, bạn đồng ý với <Link href="#" className="text-primary-container hover:underline">Điều khoản</Link> và <Link href="#" className="text-primary-container hover:underline">Chính sách bảo mật</Link> của TechBite Pro.
          </p>
        </form>
      </div>

      <div className="mt-md text-center">
        <div className="inline-flex items-center gap-xs text-on-secondary-fixed-variant font-label-md text-label-md bg-secondary-fixed px-sm py-1 rounded-full border border-outline-variant">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Hệ thống đang hoạt động tối ưu
        </div>
      </div>
    </div>
  );
}
