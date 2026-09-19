import React from 'react';
import MasterLayout from '@/components/layout/MasterLayout';
import ProfileNav from '@/components/auth/ProfileNav';
import LogoutButtonClient from '@/components/auth/LogoutButtonClient';

export default function ProfileRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MasterLayout>
      <div className="flex-grow w-full mx-auto py-10 mt-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
          
          {/* Left Column: Sidebar Navigation */}
          <aside className="col-span-1 flex flex-col h-fit md:sticky md:top-24 mb-8 md:mb-0">
            <ProfileNav />
            <div className="mt-xl pt-lg border-t border-surface-variant">
              <LogoutButtonClient />
            </div>
          </aside>

          {/* Right Column: Content Area */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-gutter">
            {children}
          </div>

        </div>
      </div>
    </MasterLayout>
  );
}
