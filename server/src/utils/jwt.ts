import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const generateToken = (userId: string | Types.ObjectId, role: string): string => {
  return jwt.sign(
    { id: userId.toString(), role },
    process.env.JWT_SECRET as string,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
    }
  );
};
