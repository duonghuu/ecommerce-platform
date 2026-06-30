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

    const setCookieHeaders = response.headers.getSetCookie();
    let refreshTokenVal = '';
    for (const cookieStr of setCookieHeaders) {
      if (cookieStr.startsWith('refreshToken=')) {
        refreshTokenVal = cookieStr.split(';')[0].split('=')[1];
        break;
      }
    }

    if (refreshTokenVal) {
      cookieStore.set('refreshToken', refreshTokenVal, {
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

export async function loginUser(payload: any) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Đăng nhập thất bại' };
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

    const setCookieHeaders = response.headers.getSetCookie();
    let refreshTokenVal = '';
    for (const cookieStr of setCookieHeaders) {
      if (cookieStr.startsWith('refreshToken=')) {
        refreshTokenVal = cookieStr.split(';')[0].split('=')[1];
        break;
      }
    }

    if (refreshTokenVal) {
      cookieStore.set('refreshToken', refreshTokenVal, {
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

export async function logoutUser() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Gọi API logout để backend xử lý (ví dụ xóa token trong Redis sau này)
    await fetch(`${backendUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(() => {
      // Bỏ qua lỗi gọi API (ví dụ server down)
    });

    // Clear cookies
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return { success: true };
  } catch (error) {
    return { success: false, message: 'Lỗi khi đăng xuất.' };
  }
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  if (!token) return false;

  try {
    // Decode JWT payload without verifying signature (for quick client/SSR check)
    const payloadStr = Buffer.from(token.split('.')[1], 'base64').toString();
    const payload = JSON.parse(payloadStr);
    
    // Check if token is expired (adding 10s buffer)
    if (payload.exp * 1000 < Date.now() + 10000) {
      // Token expired -> Try to refresh
      const refreshResult = await refreshAuthToken();
      return refreshResult.success;
    }
    
    return true;
  } catch (e) {
    // Invalid token format
    return false;
  }
}

export async function refreshAuthToken() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return { success: false, message: 'Không có refresh token' };
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refreshToken=${refreshToken}`
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Clear cookies if refresh fails (token expired/invalid)
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
      return { success: false, message: data.message || 'Refresh token thất bại' };
    }

    if (data.data?.accessToken) {
      cookieStore.set('accessToken', data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60, // 15 minutes
      });
    }

    const setCookieHeaders = response.headers.getSetCookie();
    let refreshTokenVal = '';
    for (const cookieStr of setCookieHeaders) {
      if (cookieStr.startsWith('refreshToken=')) {
        refreshTokenVal = cookieStr.split(';')[0].split('=')[1];
        break;
      }
    }

    if (refreshTokenVal) {
      cookieStore.set('refreshToken', refreshTokenVal, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return { success: true, accessToken: data.data?.accessToken };
  } catch (error) {
    return { success: false, message: 'Lỗi khi refresh token.' };
  }
}
