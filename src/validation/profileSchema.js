import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
});
