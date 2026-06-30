import { z } from 'zod';

export const ChangePasswordPayloadSchema = z.object({
  oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
});

export type ChangePasswordDto = z.infer<typeof ChangePasswordPayloadSchema>;
