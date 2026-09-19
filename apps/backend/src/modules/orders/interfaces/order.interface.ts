import { Order, OrderItem } from '@prisma/client';
import { Request } from 'express';

export interface AuthenticatedUserPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUserPayload;
}

export interface OptionalAuthenticatedRequest extends Request {
  user?: AuthenticatedUserPayload;
}

export interface PaginatedOrdersResponse {
  items: (Order & { items: OrderItem[] })[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaymentWebhookBody {
  orderCode: string;
  status: 'SUCCESS' | 'FAILED';
}
