import z from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(3, 'Le nom de la catégorie est requis et au minimum 3 caractères').max(50, 'Le nom ne peut pas dépasser 50 caractères')
});

export const updateCategorySchema = z.object({
  name: z.string().min(3).max(50).optional()
});
