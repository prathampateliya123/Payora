import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

export const registerUser = async (data) => {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    throw new Error('Please provide name, email, and password');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  const token = generateToken(user._id, user.role);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    },
    token
  };
};

export const loginUser = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('Account is inactive. Please contact support.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id, user.role);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    },
    token
  };
};