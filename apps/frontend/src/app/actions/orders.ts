'use server';

import { serverFetch } from '@/lib/serverFetch';

export type OrderStatusType = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethodType = 'COD' | 'QR_CODE';
export type PaymentStatusType = 'PENDING' | 'PAID' | 'FAILED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  productImage: string;
  price: number | string;
  quantity: number;
  createdAt: string;
}

export interface OrderDetail {
  id: string;
  code: string;
  userId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  shippingAddress: string;
  shippingMethod: string;
  shippingFee: number | string;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatusType;
  status: OrderStatusType;
  subTotal: number | string;
  discountAmount: number | string;
  discountCode: string | null;
  totalAmount: number | string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrdersPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetOrdersResult {
  success: boolean;
  message?: string;
  data?: {
    items: OrderDetail[];
    pagination: OrdersPagination;
  };
}

export interface GetOrderDetailResult {
  success: boolean;
  message?: string;
  data?: OrderDetail;
}

export async function getMyOrdersServer(page = 1, limit = 10): Promise<GetOrdersResult> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3302/api/v1';
    const response = await serverFetch(`${backendUrl}/orders/my-orders?page=${page}&limit=${limit}`, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Lỗi khi lấy danh sách đơn hàng' };
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error in getMyOrdersServer:', error);
    return { success: false, message: 'Lỗi kết nối đến máy chủ.' };
  }
}

export async function getOrderDetailServer(id: string): Promise<GetOrderDetailResult> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3302/api/v1';
    const response = await serverFetch(`${backendUrl}/orders/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Lỗi khi lấy thông tin đơn hàng' };
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error in getOrderDetailServer:', error);
    return { success: false, message: 'Lỗi kết nối đến máy chủ.' };
  }
}
