import z from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(3, 'Le nom de la catégorie est requis et au minimum 3 caractères').max(50, 'Le nom ne peut pas dépasser 50 caractères')
  .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  description: z.string().max(255).optional(),
});


export const updateCategorySchema = z.object({
  name: z.string()
    .min(3, 'Le nom doit avoir au moins 3 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .optional(),
  description: z.string()
    .max(255, 'La description ne peut pas dépasser 255 caractères')
    .optional(),
});

