import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi zorunludur.')
    .email('Geçerli bir e-posta adresi giriniz.'),
  password: z.string().min(1, 'Şifre zorunludur.'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
