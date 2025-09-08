import z from "zod";
import { dateSchema } from "./base.validator";

export const monthlyQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Format de mois invalide (YYYY-MM)').optional()
});

export const summaryQuerySchema = z.object({
  start: dateSchema.optional(),
  end: dateSchema.optional()
});
