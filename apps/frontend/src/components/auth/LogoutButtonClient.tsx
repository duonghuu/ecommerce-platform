"use client";

import React, { useState } from 'react';
import LogoutButton from './LogoutButton';
import { logoutUser } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export default function LogoutButtonClient() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      router.push('/login');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return <LogoutButton onLogout={handleLogout} isLoading={isLoggingOut} />;
}
