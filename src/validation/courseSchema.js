import { z } from 'zod';

export const courseSchema = z.object({
  id: z.string().min(1, 'Course ID is required'),
  title: z.string().min(1, 'Title is required'),
  meta: z.string().optional(),
  description: z.string().optional(),
  department: z.string().optional(),
  term: z.string().optional(),
  credits: z.number().optional(),
  instructor_name: z.string().optional(),
  instructor_role: z.string().optional(),
  instructor_email: z.string().email().optional(),
  instructor_office: z.string().optional(),
  instructor_hours: z.string().optional(),
});

export const sessionSchema = z.object({
  course_id: z.string().min(1, 'Course ID is required'),
  month: z.string().min(1, 'Month is required'),
  day: z.string().min(1, 'Day is required'),
  title: z.string().min(1, 'Title is required'),
  meta: z.string().optional(),
  tone: z.string().optional(),
});
