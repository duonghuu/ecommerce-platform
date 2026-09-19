import React from 'react';
import MasterLayout from '@/components/layout/MasterLayout';

export default function OrderDetailLoading() {
  return (
    <MasterLayout>
      <div className="max-w-5xl mx-auto py-10 px-4 mt-4 mb-16">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-slate-200 rounded"></div>
          <div className="flex justify-between items-center">
            <div className="h-8 w-60 bg-slate-200 rounded"></div>
            <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="h-48 bg-slate-100 rounded-2xl border border-slate-200"></div>
              <div className="h-40 bg-slate-100 rounded-2xl border border-slate-200"></div>
            </div>
            <div className="h-72 bg-slate-100 rounded-2xl border border-slate-200"></div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}
