import React from 'react';
import MasterLayout from '@/components/layout/MasterLayout';

export default function OrdersLoading() {
  return (
    <MasterLayout>
      <div className="max-w-6xl mx-auto py-10 px-4 mt-6 mb-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
          <div className="h-5 w-80 bg-slate-200 rounded-lg"></div>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="h-10 bg-slate-100 rounded-xl"></div>
            <div className="h-14 bg-slate-100 rounded-xl"></div>
            <div className="h-14 bg-slate-100 rounded-xl"></div>
            <div className="h-14 bg-slate-100 rounded-xl"></div>
            <div className="h-14 bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}
