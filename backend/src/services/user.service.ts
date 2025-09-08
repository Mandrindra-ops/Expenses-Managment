import User from '../models/user.model';
import bcrypt from 'bcryptjs';


export const getUserProfile = async (userId: number) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'email', 'createdAt', 'updatedAt'],
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};


export const changePassword = async (userId: number, oldPassword: string, newPassword: string) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error('Old password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashedPassword });

  return { message: 'Password updated successfully' };
};
