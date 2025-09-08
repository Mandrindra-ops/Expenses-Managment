import z from "zod";
import { dateSchema } from "./base.validator";

export const createExpenseSchema = z
  .object({
    amount: z.number().positive("Le montant doit être positif"),
    date: dateSchema,
    categoryId: z.number(),
    description: z.string().optional(),
    type: z.enum(["OneTime", "Recurring"]).default("OneTime"),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    receipt: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "Recurring") {
        return data.startDate && data.endDate;
      }
      return true;
    },
    {
      message:
        "Les dates de début et fin sont requises pour les dépenses récurrentes",
    }
  );

export const updateExpenseSchema = z.object({
  amount: z.number().positive().optional(),
  date: dateSchema.optional(),
  categoryId: z.number().optional(),
  description: z.string().optional(),
  type: z.enum(["OneTime", "Recurring"]).optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  receipt: z.any().optional(),
});

export const expenseQuerySchema = z.object({
  start: dateSchema.optional(),
  end: dateSchema.optional(),
  category: z.string().optional(),
  type: z.enum(["Recurring", "OneTime"]).optional(),
});
