import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    name: string;
    usertype?: string;
  };
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided',
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = AuthService.verifyAccessToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
      name: decoded.name,
      usertype: decoded.usertype,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Middleware to check if user is admin
 */
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  if (req.user.usertype !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Admin access required',
    });
    return;
  }

  next();
};