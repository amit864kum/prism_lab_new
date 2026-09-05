import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().max(254).email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(256),
})

export type LoginInput = z.infer<typeof loginSchema>
