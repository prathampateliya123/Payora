import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId.toString(), role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};