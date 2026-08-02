'use server';

import { cookies } from 'next/headers';

export async function createOrderServer(payload: any) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

    const response = await fetch(`${apiUrl}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, status: response.status, message: data.message || 'Lỗi khi tạo đơn hàng' };
    }

    return { success: true, data: data.data };
  } catch (error: any) {
    console.error('Create Order API Error:', error);
    return { success: false, message: 'Đã xảy ra lỗi hệ thống' };
  }
}
