import { z } from 'zod';

export const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  agreed: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  })
});

export const submissionRequestSchema = z.object({
  submissionId: z.string().min(1, 'Submission ID is required')
});

export type FormSchema = z.infer<typeof formSchema>;
export type SubmissionRequestSchema = z.infer<typeof submissionRequestSchema>;