"use client";

import React, { useState } from 'react';
import MasterLayout from '@/components/layout/MasterLayout';
import RegisterForm, { RegisterFormPayload } from '@/components/auth/RegisterForm';
import { registerUser } from '@/app/actions/auth';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleRegister = async (data: RegisterFormPayload) => {
    setIsLoading(true);
    setErrorMessage(undefined);
    
    // Bỏ trường confirmPassword ra khỏi payload gửi lên Backend
    const { confirmPassword, ...registerPayload } = data;
    
    try {
      const result = await registerUser(registerPayload);
      if (result.success) {
        // Tự động đăng nhập thành công (token đã được lưu vào cookies ở Server Action)
        window.location.href = '/'; // Chuyển hướng về trang chủ
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
        <RegisterForm 
          isLoading={isLoading} 
          errorMessage={errorMessage} 
          onSubmit={handleRegister} 
        />
      </div>
    </MasterLayout>
  );
}
