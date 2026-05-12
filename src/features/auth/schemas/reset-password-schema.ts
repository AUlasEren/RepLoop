import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    code: z
      .string()
      .min(1, 'Kod zorunludur.')
      .regex(/^\d{6}$/, 'Kod 6 haneli rakamlardan oluşmalıdır.'),
    newPassword: z
      .string()
      .min(1, 'Yeni şifre zorunludur.')
      .min(8, 'Yeni şifre en az 8 karakter olmalıdır.')
      .regex(/\d/, 'Yeni şifre en az bir rakam içermelidir.'),
    confirmPassword: z.string().min(1, 'Şifre tekrarı zorunludur.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Şifreler eşleşmiyor.',
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
