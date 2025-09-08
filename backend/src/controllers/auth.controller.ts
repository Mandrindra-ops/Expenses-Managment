import { Request,Response } from 'express';
import dotenv from 'dotenv';
import * as authService from "../services/auth.service"
import { InvalidUserError } from '../errors/InvalidUserError';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { InvalidCredentialError } from '../errors/InvalidCredentialError';

dotenv.config();

export const signup = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const user = await authService.signup(email,password)
    res.json(user)
  } catch (error) {
    console.error(error);
    if (error instanceof InvalidUserError) {
      return res.status(400).json({ message : error.message})
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const token = await authService.login(email ,password)
    res.json({ token });
  } catch (error: any) {
    if (error instanceof UserNotFoundError) {
      return res.status(404).json({ message : error.message})
    } else if (error instanceof InvalidCredentialError) {
      return res.status(404).json({ message : error.message})
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const me = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    res.json({ id: user.id, email: user.email });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
