import { z } from 'zod';

export const LoginPayloadSchema = z.object({
  email: z.string().email('Định dạng email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export type LoginDto = z.infer<typeof LoginPayloadSchema>;
