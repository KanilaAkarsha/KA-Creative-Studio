import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Enter a valid email address'),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterValues = z.infer<typeof registerSchema>;

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  role: z.string().max(100).optional(),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
});

export type ReviewValues = z.infer<typeof reviewSchema>;
