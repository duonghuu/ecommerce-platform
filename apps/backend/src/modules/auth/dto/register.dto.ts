import { z } from 'zod';

export const RegisterPayloadSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được để trống'),
  email: z.string().email('Định dạng email không hợp lệ'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ').optional(),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type RegisterDto = z.infer<typeof RegisterPayloadSchema>;
