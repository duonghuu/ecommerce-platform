"use server";

import { cookies } from 'next/headers';

export async function registerUser(payload: any) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Đăng ký thất bại' };
    }

    // Success -> Save tokens in cookies
    const cookieStore = await cookies();

    if (data.data?.accessToken) {
      cookieStore.set('accessToken', data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60, // 15 minutes
      });
    }

    if (data.data?.refreshToken) {
      cookieStore.set('refreshToken', data.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: 'Lỗi kết nối đến máy chủ.' };
  }
}
