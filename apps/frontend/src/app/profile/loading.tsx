import React from 'react';
import MasterLayout from '@/components/layout/MasterLayout';

export default function ProfileLoading() {
  return (
    <MasterLayout>
      <div className="flex-grow w-full mx-auto py-10 mt-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <aside className="col-span-1 flex flex-col h-fit md:sticky md:top-24 mb-8 md:mb-0">
            <div className="animate-pulse flex flex-col gap-2">
              <div className="h-12 bg-surface-container-low rounded-xl"></div>
              <div className="h-12 bg-surface-container-low rounded-xl"></div>
              <div className="h-12 bg-surface-container-low rounded-xl"></div>
            </div>
          </aside>
          
          <div className="col-span-1 md:col-span-3 flex flex-col gap-gutter">
            <div className="animate-pulse space-y-8">
              <div className="h-64 bg-surface-container-low rounded-2xl"></div>
              <div className="h-64 bg-surface-container-low rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}
