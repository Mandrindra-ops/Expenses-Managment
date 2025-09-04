import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Étendre l'interface Request pour inclure `user`
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email?: string; 
      };
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as { id: number; email?: string };

    // On ajoute l'utilisateur à la requête
    req.user = { id: decoded.id, email: decoded.email };

    next(); // passer au middleware suivant ou au controller
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
