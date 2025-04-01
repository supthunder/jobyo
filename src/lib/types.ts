import { z } from 'zod';

export const jobStatuses = [
  'APPLIED',
  'ONLINE_TEST',
  'RECORDED_INTERVIEW',
  'FIRST_INTERVIEW',
  'SECOND_INTERVIEW',
  'ASSESSMENT_CENTER',
  'REJECTED',
  'WITHDRAWN',
] as const;

export const jobFormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  jobUrl: z.string().url().optional().or(z.literal('')),
  dateApplied: z.date(),
  status: z.enum(jobStatuses),
  notes: z.string().optional(),
});

export type JobFormData = z.infer<typeof jobFormSchema>;

export type JobApplication = JobFormData & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}; 