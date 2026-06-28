import React from 'react';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role?: string;
}

export interface ProfileInfoProps {
  user: User;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-md shadow-[0_10px_15px_-3px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Thông tin cá nhân</h2>
        <button className="text-primary font-bold font-label-md text-label-md hover:underline">Chỉnh sửa</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tên</label>
          <p className="font-body-lg text-body-lg text-on-surface font-semibold">{user.fullName}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Email</label>
          <p className="font-body-lg text-body-lg text-on-surface font-semibold">{user.email}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">SĐT</label>
          <p className="font-body-lg text-body-lg text-on-surface font-semibold">{user.phone}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Vai trò</label>
          <p className="font-body-lg text-body-lg text-on-surface font-semibold">{user.role || 'Thành viên'}</p>
        </div>
      </div>
    </section>
  );
}
