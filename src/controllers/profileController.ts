import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/profileService';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    name: string;
    usertype: string;
  };
}

export class ProfileController {
  /**
   * Get current user profile
   * GET /api/profile
   */
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const profile = await ProfileService.getProfile(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   * PATCH /api/profile
   */
  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { name, phone, address } = req.body;

      // Validate that at least one field is provided
      if (name === undefined && phone === undefined && address === undefined) {
        res.status(400).json({
          success: false,
          message: 'At least one field (name, phone, or address) must be provided',
        });
        return;
      }

      const profile = await ProfileService.updateProfile(req.user.id, {
        name,
        phone,
        address,
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }
}