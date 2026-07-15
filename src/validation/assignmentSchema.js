import { z } from 'zod';

export var assignmentSchema = z.object({
  course_id: z.string().min(1, 'Course ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  due_date: z.string().min(1, 'Due date is required'),
});

export var submissionSchema = z.object({
  submission_text: z.string().optional(),
  file_url: z.string().optional(),
}).refine(function (data) {
  return data.submission_text || data.file_url;
}, { message: 'Either submission text or a file is required' });
