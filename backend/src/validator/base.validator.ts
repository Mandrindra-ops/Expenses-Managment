import z from "zod";

export const idParamSchema = z.object({
  id: z.number()
})
export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(6, 'Password must have min 6 characters');
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid Date Format (YYYY-MM-DD)');
