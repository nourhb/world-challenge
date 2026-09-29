import { z } from 'zod';

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(24, 'Username must be at most 24 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Use letters, numbers, and underscores only'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
    countryId: z.string().min(1, 'Choose your country'),
    dateOfBirth: z.string().min(1, 'Enter your date of birth'),
    termsAccepted: z.boolean().refine((value) => value, {
      message: 'You must accept the terms',
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((values) => isAdult(values.dateOfBirth), {
    message: 'You must be at least 18 years old',
    path: ['dateOfBirth'],
  });

export const loginSchema = z.object({
  identifier: z.string().min(3, 'Enter your username or email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(3, 'Enter your username or email'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(32, 'This reset link is missing or incomplete'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterValues = z.infer<typeof registerSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function isAdult(dateOfBirth: string, now = new Date()): boolean {
  const birth = new Date(`${dateOfBirth}T00:00:00.000Z`);
  if (Number.isNaN(birth.getTime())) {
    return false;
  }
  const eighteenth = new Date(birth);
  eighteenth.setUTCFullYear(eighteenth.getUTCFullYear() + 18);
  return eighteenth.getTime() <= now.getTime();
}
