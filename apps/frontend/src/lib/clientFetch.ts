import { refreshAuthToken } from '@/app/actions/auth';

/**
 * Hàm fetch dành riêng cho Client Components.
 * Xử lý tự động Refresh Token nếu gặp lỗi 401 khi gọi API Next.js Route Handlers hoặc Backend (nếu Backend cho phép credentials).
 */
export async function clientFetch(url: string, options: RequestInit = {}) {
  let response = await fetch(url, {
    ...options,
    credentials: 'include', // Gửi HttpOnly cookies đi kèm
  });

  // Nếu token hết hạn hoặc không hợp lệ (401)
  if (response.status === 401) {
    // Gọi Server Action để refresh token (Server Action sẽ set lại cookie trên trình duyệt)
    const refreshResult = await refreshAuthToken();

    if (refreshResult.success) {
      // Retry API request
      response = await fetch(url, {
        ...options,
        credentials: 'include',
      });
    } else {
      // Nếu refresh thất bại, redirect về trang login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }

  return response;
}
