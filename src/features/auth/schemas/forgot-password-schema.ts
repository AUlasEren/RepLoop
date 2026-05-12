import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi zorunludur.')
    .email('Geçerli bir e-posta adresi giriniz.'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
