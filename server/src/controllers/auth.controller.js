
import * as authService from '../services/auth.service.js';


export const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Registration failed',
      errors: [error.message]
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Login failed',
      errors: [error.message]
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['User not attached to request']
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Current user fetched',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      errors: [error.message]
    });
  }
};