import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().positive(),
  recipientId: z.string().uuid(),
  description: z.string().optional(),
});

export const messageSchema = z.object({
  content: z.string().min(1),
  recipientId: z.string().uuid(),
  isEncrypted: z.boolean().default(false),
});

export const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  profilePicture: z.string().optional(),
});