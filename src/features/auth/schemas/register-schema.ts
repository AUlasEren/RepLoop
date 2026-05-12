import { z } from 'zod';

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(1, 'Ad zorunludur.')
      .min(2, 'Ad en az 2 karakter olmalıdır.')
      .max(100, 'Ad en fazla 100 karakter olabilir.'),
    email: z
      .string()
      .min(1, 'E-posta adresi zorunludur.')
      .email('Geçerli bir e-posta adresi giriniz.'),
    password: z
      .string()
      .min(1, 'Şifre zorunludur.')
      .min(8, 'Şifre en az 8 karakter olmalıdır.')
      .regex(/\d/, 'Şifre en az bir rakam içermelidir.'),
    confirmPassword: z.string().min(1, 'Şifre tekrarı zorunludur.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Şifreler eşleşmiyor.',
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
