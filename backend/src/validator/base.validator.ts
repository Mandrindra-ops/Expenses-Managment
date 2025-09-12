import z from "zod";

export const idParamSchema = z.object({
  id:  z.preprocess(val => {
    if (typeof val === "string") return parseInt(val, 10);
    console.log(val)
        return val;
  }, z.number())})
export const emailSchema = z.string().email();
export const passwordSchema = z.string()
  .min(6, "Password must be at least 6 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one digit")
  .regex(/[@$!%*?&#]/, "Password must contain at least one special character");
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid Date Format (YYYY-MM-DD)');
