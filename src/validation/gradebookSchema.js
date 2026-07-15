import { z } from 'zod';

export const gradebookEntrySchema = z.object({
  hw1: z.number().min(0).max(100).optional().nullable(),
  quiz1: z.number().min(0).max(50).optional().nullable(),
  midterm: z.number().min(0).max(200).optional().nullable(),
  hw2: z.number().min(0).max(100).optional().nullable(),
  attention: z.boolean().optional(),
  excused: z.boolean().optional(),
});
