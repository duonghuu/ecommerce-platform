"use client";

import React, { useState } from 'react';
import LoginForm, { LoginPayload } from '@/components/auth/LoginForm';
import MasterLayout from '@/components/layout/MasterLayout';
import { loginUser } from '@/app/actions/auth';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleLogin = async (data: LoginPayload) => {
    setIsLoading(true);
    setErrorMessage(undefined);
    
    try {
      const result = await loginUser(data);
      if (result.success) {
        // Tự động chuyển hướng về trang chủ sau khi lưu cookie thành công ở Server Action
        window.location.href = '/';
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Đã xảy ra lỗi hệ thống. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MasterLayout>
      <div className="flex-grow flex items-center justify-center py-xl bg-surface">
        <LoginForm 
          isLoading={isLoading} 
          errorMessage={errorMessage} 
          onSubmit={handleLogin} 
        />
      </div>
    </MasterLayout>
  );
}
