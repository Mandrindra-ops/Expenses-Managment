import z from "zod";
import { dateSchema } from "./base.validator";

export const createIncomeSchema = z.object({
  amount: z.number().positive('Le montant doit être positif'),
  date: dateSchema,
  source: z.string().optional(),
  description: z.string().optional()
});

export const updateIncomeSchema = z.object({
  amount: z.number().positive().optional(),
  date: dateSchema.optional(),
  source: z.string().optional(),
  description: z.string().optional()
});

export const incomeQuerySchema = z.object({
  start: dateSchema.optional(),
  end: dateSchema.optional()
});
