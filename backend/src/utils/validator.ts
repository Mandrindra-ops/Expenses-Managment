import { NextFunction, Request, Response } from "express";
import z from "zod";
import { createExpenseSchema, updateExpenseSchema } from "../validator/expences.validator";

export const validateBody = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.body);
      req.body = result;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid Data',
          details: error.message
          });
        };

      next(error as any);
      }

    }
  };

export const validateQuery = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.message });
    }
    req.query = result.data as unknown as typeof req.query;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: ' Invalid request parameters ',
          details: error.message
        });
      }
      next(error);
    }
  };
};

export const validateParams = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.params);
         if (!result.success) {
      return res.status(400).json({ errors: result.error.message });
    }
    req.params = result.data as unknown as typeof req.params;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Paramètres invalides',
          details: error.message
        });
      }
      next(error);
    }
  };
};

// Middleware spécial pour les données multipart (expenses avec fichiers)
export const validateMultipartExpense = (isUpdate = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Convertir les champs numériques des string vers number
      if (req.body.amount) {
        req.body.amount = parseFloat(req.body.amount);
      }

      // Appliquer le schéma approprié
      const schema = isUpdate ? updateExpenseSchema : createExpenseSchema;
      const result = schema.parse(req.body);
      req.body = result;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid Data',
          details: error.message
        });
      }
      next(error);
    }
  };
};
