import z from "zod";

export const receiptIdSchema = z.object({
  id: z.string().min(1, 'ID du reçu requis')
});
