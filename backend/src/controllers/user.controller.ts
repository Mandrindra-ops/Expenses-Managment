import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserProfile(req.user!.id);
    res.json(user);
  } catch (error: any) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new passwords are required' });
    }

    const result = await userService.changePassword(req.user!.id, oldPassword, newPassword);
    res.json(result);
  } catch (error: any) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Old password is incorrect') {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
