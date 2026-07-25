"use server";

import { serverFetch } from '@/lib/serverFetch';
import { revalidateTag } from 'next/cache';
import { checkAuth } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3302/api/v1';

export async function getCartServer() {
  const isAuth = await checkAuth();
  if (!isAuth) return { success: false, status: 401 };

  try {
    const res = await serverFetch(`${API_URL}/cart`);
    if (!res.ok) return { success: false, status: res.status };
    const json = await res.json();
    return { success: true, data: json.data };
  } catch (error) {
    return { success: false, status: 500 };
  }
}

export async function addCartItemServer(productId: string, quantity: number) {
  const isAuth = await checkAuth();
  if (!isAuth) return { success: false, status: 401 };

  try {
    const res = await serverFetch(`${API_URL}/cart/items`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    if (!res.ok) {
       return { success: false, message: json.message || 'Lỗi thêm sản phẩm' };
    }
    revalidateTag('cart');
    return { success: true, data: json.data };
  } catch (error) {
    return { success: false, message: 'Lỗi kết nối máy chủ' };
  }
}

export async function updateCartItemServer(productId: string, quantity: number) {
  const isAuth = await checkAuth();
  if (!isAuth) return { success: false, status: 401 };

  try {
    const res = await serverFetch(`${API_URL}/cart/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    if (!res.ok) {
       return { success: false, message: json.message || 'Lỗi cập nhật sản phẩm' };
    }
    revalidateTag('cart');
    return { success: true, data: json.data };
  } catch (error) {
    return { success: false, message: 'Lỗi kết nối máy chủ' };
  }
}

export async function removeCartItemServer(productId: string) {
  const isAuth = await checkAuth();
  if (!isAuth) return { success: false, status: 401 };

  try {
    const res = await serverFetch(`${API_URL}/cart/items/${productId}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!res.ok) {
       return { success: false, message: json.message || 'Lỗi xóa sản phẩm' };
    }
    revalidateTag('cart');
    return { success: true, data: json.data };
  } catch (error) {
    return { success: false, message: 'Lỗi kết nối máy chủ' };
  }
}

export async function syncCartServer(items: { productId: string, quantity: number }[]) {
  const isAuth = await checkAuth();
  if (!isAuth) return { success: false, status: 401 };

  if (!items || items.length === 0) return { success: true };

  try {
    const res = await serverFetch(`${API_URL}/cart/sync`, {
      method: 'POST',
      body: JSON.stringify({ items }),
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.message };
    revalidateTag('cart');
    return { success: true, data: json.data };
  } catch (error) {
    return { success: false, message: 'Lỗi kết nối máy chủ' };
  }
}
