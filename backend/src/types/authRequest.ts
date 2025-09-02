// src/types/authRequest.ts
import { Request } from "express";

export interface AuthRequest extends Request {
  user?: { userId: number }; // adjust according to your JWT payload
}
