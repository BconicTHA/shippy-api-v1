import { Request, Response, NextFunction } from 'express';
import { ShipmentService } from '../services/shipmentService';
import { CreateShipmentRequest, UpdateShipmentStatusRequest } from '../types/shipment';

// Extend Express Request to include user from auth middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    name: string;
    usertype: string;
    iat: number;
    exp: number;
  };
}

export class ShipmentController {
  /**
   * Create a new shipment
   * POST /api/shipments
   */
  static async createShipment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const data: CreateShipmentRequest = req.body;

      // Validate required fields
      const requiredFields = [
        'senderName', 'senderAddress', 'senderCity', 'senderZipCode', 'senderCountry',
        'receiverName', 'receiverAddress', 'receiverCity', 'receiverZipCode', 'receiverCountry',
        'packageWeight', 'packageType'
      ];

      const missingFields = requiredFields.filter(field => !data[field as keyof CreateShipmentRequest]);

      if (missingFields.length > 0) {
        res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`,
        });
        return;
      }

      const shipment = await ShipmentService.createShipment(req.user.id, data);

      res.status(201).json({
        success: true,
        message: 'Shipment created successfully',
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all shipments for current user or all shipments for admin
   * GET /api/shipments
   */
  static async getShipments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const isAdmin = req.user.usertype === 'admin';
      
      const shipments = isAdmin 
        ? await ShipmentService.getAllShipments()
        : await ShipmentService.getUserShipments(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Shipments retrieved successfully',
        data: shipments,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single shipment by ID
   * GET /api/shipments/:id
   */
  static async getShipmentById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { id } = req.params;
      const isAdmin = req.user.usertype === 'admin';

      const shipment = await ShipmentService.getShipmentById(id, req.user.id, isAdmin);

      res.status(200).json({
        success: true,
        message: 'Shipment retrieved successfully',
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get shipment by tracking number
   * GET /api/shipments/track/:trackingNumber
   */
  static async trackShipment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { trackingNumber } = req.params;

      const shipment = await ShipmentService.getShipmentByTrackingNumber(trackingNumber);

      res.status(200).json({
        success: true,
        message: 'Shipment retrieved successfully',
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update shipment status (admin only)
   * PATCH /api/shipments/:id/status
   */
  static async updateShipmentStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { id } = req.params;
      const { status }: UpdateShipmentStatusRequest = req.body;

      if (!status) {
        res.status(400).json({
          success: false,
          message: 'Status is required',
        });
        return;
      }

      const validStatuses = ['pending', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status value',
        });
        return;
      }

      const isAdmin = req.user.usertype === 'admin';
      const shipment = await ShipmentService.updateShipmentStatus(id, status, isAdmin);

      res.status(200).json({
        success: true,
        message: 'Shipment status updated successfully',
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a shipment
   * DELETE /api/shipments/:id
   */
  static async deleteShipment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { id } = req.params;
      const isAdmin = req.user.usertype === 'admin';

      await ShipmentService.deleteShipment(id, req.user.id, isAdmin);

      res.status(200).json({
        success: true,
        message: 'Shipment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get shipment statistics
   * GET /api/shipments/stats
   */
  static async getStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const isAdmin = req.user.usertype === 'admin';
      const stats = await ShipmentService.getShipmentStats(req.user.id, isAdmin);

      res.status(200).json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}