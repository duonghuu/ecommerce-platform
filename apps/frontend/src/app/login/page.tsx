"use client";

import React, { useState } from 'react';
import LoginForm, { LoginPayload } from '@/components/auth/LoginForm';
import MasterLayout from '@/components/layout/MasterLayout';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleLogin = async (data: LoginPayload) => {
    setIsLoading(true);
    setErrorMessage(undefined);
    
    // Mock API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (data.email === 'admin@techbite.vn' && data.password === '123456') {
        // Handle success scenario (redirect, update state)
        window.location.href = '/';
      } else {
        setErrorMessage('Email hoặc mật khẩu không chính xác');
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
