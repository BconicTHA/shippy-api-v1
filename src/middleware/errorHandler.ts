import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  // Handle specific error types
  if (err.message === 'Invalid credentials') {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
    return;
  }

  if (err.message === 'Passwords do not match') {
    res.status(400).json({
      success: false,
      message: 'Passwords do not match',
    });
    return;
  }

  if (err.message === 'Email already exists') {
    res.status(409).json({
      success: false,
      message: 'Email already exists',
    });
    return;
  }

  if (err.message === 'Username already exists') {
    res.status(409).json({
      success: false,
      message: 'Username already exists',
    });
    return;
  }

  if (err.message === 'Invalid or expired token') {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
    return;
  }

  if (err.message === 'Invalid token') {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
    return;
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};