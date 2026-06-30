"use client";

import React, { useState } from 'react';
import { changeUserPassword } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);

    try {
      const res = await changeUserPassword({
        oldPassword,
        newPassword
      });

      if (!res.success) {
        setError(res.message);
      } else {
        setSuccess('Đổi mật khẩu thành công. Đang chuyển hướng đến trang đăng nhập...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      setError('Đã xảy ra lỗi, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-md shadow-[0_10px_15px_-3px_rgba(15,23,42,0.05)]">
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Đổi mật khẩu</h2>

      {error && (
        <div className="mb-sm p-sm bg-red-50 border border-red-200 text-red-600 rounded-xl font-body-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-sm p-sm bg-green-50 border border-green-200 text-green-700 rounded-xl font-body-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-sm">
        <div className="flex flex-col gap-base">
          <label className="font-label-md text-label-md text-on-surface-variant">Mật khẩu hiện tại</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-md py-sm rounded-xl border border-slate-200 bg-white text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
            required
            disabled={isLoading || !!success}
          />
        </div>

        <div className="flex flex-col gap-base">
          <label className="font-label-md text-label-md text-on-surface-variant">Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-md py-sm rounded-xl border border-slate-200 bg-white text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
            required
            disabled={isLoading || !!success}
          />
        </div>

        <div className="flex flex-col gap-base">
          <label className="font-label-md text-label-md text-on-surface-variant">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-md py-sm rounded-xl border border-slate-200 bg-white text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
            required
            disabled={isLoading || !!success}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !!success}
          className="mt-sm w-full bg-primary-container text-white font-semibold py-sm rounded-xl hover:bg-primary transition-colors duration-200 active:scale-95 shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              <span>Đang xử lý...</span>
            </>
          ) : (
            <span>Đổi mật khẩu</span>
          )}
        </button>
      </form>
    </section>
  );
}
