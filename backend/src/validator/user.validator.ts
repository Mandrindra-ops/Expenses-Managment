import { z } from "zod";
import { passwordSchema } from "./base.validator";

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Old password must be at least 6 characters long"),
  newPassword: passwordSchema
});
