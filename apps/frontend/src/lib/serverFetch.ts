import { cookies } from 'next/headers';
import { refreshAuthToken } from '@/app/actions/auth';

/**
 * Hàm fetch dành riêng cho Server Components và Server Actions.
 * Tự động đính kèm Access Token và xử lý Refresh Token nếu gặp lỗi 401.
 */
export async function serverFetch(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('accessToken')?.value;

  const headers = new Headers(options.headers || {});
  
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Nếu token hết hạn hoặc không hợp lệ (401)
  if (response.status === 401) {
    // Thử gọi hàm refresh token
    const refreshResult = await refreshAuthToken();

    if (refreshResult.success && refreshResult.accessToken) {
      // Cập nhật lại accessToken mới vào header và thử gọi lại API
      accessToken = refreshResult.accessToken;
      headers.set('Authorization', `Bearer ${accessToken}`);
      
      response = await fetch(url, {
        ...options,
        headers,
      });
    }
  }

  return response;
}
