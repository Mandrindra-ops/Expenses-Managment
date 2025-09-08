import z from "zod";
import { emailSchema, passwordSchema } from "./base.validator";

export const authShema = z.object({
  email: emailSchema,
  password: passwordSchema
});
