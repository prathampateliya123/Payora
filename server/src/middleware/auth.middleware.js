import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import { JwtPayload, AuthenticatedRequest } from '../types/auth.types.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized to access this route', errors: ['No token provided'] });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ success: false, message: 'Not authorized to access this route', errors: ['User not found'] });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({ success: false, message: 'Not authorized to access this route', errors: ['User account is inactive'] });
      return;
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name
    };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized to access this route', errors: ['Invalid or expired token'] });
    return;
  }
};