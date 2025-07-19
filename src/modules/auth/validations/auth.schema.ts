import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetSchema = z
  .object({
    token: z.string({
      required_error: 'Token requerido',
    }),
    password: z.string({
      required_error: 'Contraseña requerida',
    }),
    confirmPassword: z.string({
      required_error: 'Confirmar contraseña requerida',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Las contraseñas no coinciden',
      });
    }
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetSchemaInput = z.infer<typeof resetSchema>;
