import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { LoginRequest, RegisterRequest } from '../types/auth';

export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: RegisterRequest = req.body;

      // Validate required fields
      if (!data.username || !data.email || !data.password || !data.password_confirmation || !data.name || !data.usertype) {
        res.status(400).json({
          success: false,
          message: 'All fields are required',
        });
        return;
      }

      const result = await AuthService.register(data);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/dashboard/login
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: LoginRequest = req.body;

      // Validate required fields
      if (!data.email || !data.password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
        return;
      }

      const result = await AuthService.login(data);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   * POST /api/dashboard/refresh
   */
  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      const result = await AuthService.refreshToken(token);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   * POST /api/dashboard/logout
   */
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      await AuthService.logout(token);

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }
}