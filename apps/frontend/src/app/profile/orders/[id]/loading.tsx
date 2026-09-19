import React from 'react';

export default function ProfileOrderDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-32 bg-slate-200 rounded"></div>
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200">
        <div className="h-8 w-60 bg-slate-200 rounded"></div>
        <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-48 bg-white rounded-2xl border border-slate-200"></div>
          <div className="h-40 bg-white rounded-2xl border border-slate-200"></div>
        </div>
        <div className="h-72 bg-white rounded-2xl border border-slate-200"></div>
      </div>
    </div>
  );
}
