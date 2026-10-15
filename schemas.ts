import { z } from 'zod'

const mobile = z
  .string()
  .transform((v) => v.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, ''))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number.'))

const newPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .max(128, 'Password is too long.')
  .regex(/[A-Za-z]/, 'Password must include a letter.')
  .regex(/\d/, 'Password must include a number.')

const existingPassword = z.string().min(1, 'Enter your password.').max(128)

export const customerRegisterSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your full name.').max(80, 'Name is too long.'),
    mobile,
    password: newPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })

export const customerLoginSchema = z.object({ mobile, password: existingPassword })

export const merchantLoginSchema = z.object({
  merchantId: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9-]{4,32}$/, 'Enter a valid Merchant ID, e.g. ZUP-M-1001.'),
  password: existingPassword,
})

export const adminLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  password: existingPassword,
})
