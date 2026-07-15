import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  role: z.enum(['student', 'instructor', 'admin']),
  status: z.enum(['Active', 'Inactive', 'Offline', 'Pending']),
  password: z.string().min(1, 'Password is required').optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
});
