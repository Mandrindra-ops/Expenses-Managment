import User from '../models/user.model';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const signup = async (email: string, password: string) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error('User already exists');
  const user = await User.create({ email, password });
  return user;
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  const isValid = await user.validatePassword(password);
  if (!isValid) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  return { user, token };
};
