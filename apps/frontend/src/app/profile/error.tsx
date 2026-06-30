"use client";

import { useEffect } from 'react';
import MasterLayout from '@/components/layout/MasterLayout';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <MasterLayout>
      <div className="flex-grow w-full mx-auto py-10 mt-8 mb-16 flex flex-col items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Đã có lỗi xảy ra</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6 text-center max-w-md">
          Không thể tải thông tin cá nhân. Vui lòng thử lại sau.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 transition-all"
        >
          Thử lại
        </button>
      </div>
    </MasterLayout>
  );
}
