import { PrismaClient } from '@prisma/client';
import { CreateShipmentRequest, ShipmentStatus } from '../types/shipment';

const prisma = new PrismaClient();

export class ShipmentService {
  /**
   * Create a new shipment
   */
  static async createShipment(userId: string, data: CreateShipmentRequest) {
    try {
      const shipment = await prisma.shipment.create({
        data: {
          ...data,
          userId,
          estimatedDelivery: data.estimatedDelivery 
            ? new Date(data.estimatedDelivery) 
            : null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return shipment;
    } catch (error) {
      console.error('Error creating shipment:', error);
      throw new Error('Failed to create shipment');
    }
  }

  /**
   * Get all shipments for a specific user
   */
  static async getUserShipments(userId: string) {
    try {
      const shipments = await prisma.shipment.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return shipments;
    } catch (error) {
      console.error('Error fetching user shipments:', error);
      throw new Error('Failed to fetch shipments');
    }
  }

  /**
   * Get all shipments (admin only)
   */
  static async getAllShipments() {
    try {
      const shipments = await prisma.shipment.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return shipments;
    } catch (error) {
      console.error('Error fetching all shipments:', error);
      throw new Error('Failed to fetch shipments');
    }
  }

  /**
   * Get a single shipment by ID
   */
  static async getShipmentById(shipmentId: string, userId: string, isAdmin: boolean) {
    try {
      const shipment = await prisma.shipment.findUnique({
        where: { id: shipmentId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!shipment) {
        throw new Error('Shipment not found');
      }

      // If not admin, check if shipment belongs to user
      if (!isAdmin && shipment.userId !== userId) {
        throw new Error('Unauthorized access to shipment');
      }

      return shipment;
    } catch (error) {
      console.error('Error fetching shipment:', error);
      throw error;
    }
  }

  /**
   * Get shipment by tracking number
   */
  static async getShipmentByTrackingNumber(trackingNumber: string) {
    try {
      const shipment = await prisma.shipment.findUnique({
        where: { trackingNumber },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!shipment) {
        throw new Error('Shipment not found');
      }

      return shipment;
    } catch (error) {
      console.error('Error fetching shipment by tracking number:', error);
      throw error;
    }
  }

  /**
   * Update shipment status (admin only)
   */
  static async updateShipmentStatus(
    shipmentId: string, 
    status: ShipmentStatus,
    isAdmin: boolean
  ) {
    try {
      // Only admins can update status
      if (!isAdmin) {
        throw new Error('Unauthorized: Only admins can update shipment status');
      }

      const shipment = await prisma.shipment.update({
        where: { id: shipmentId },
        data: { 
          status,
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return shipment;
    } catch (error) {
      console.error('Error updating shipment status:', error);
      throw error;
    }
  }

  /**
   * Delete a shipment
   */
  static async deleteShipment(shipmentId: string, userId: string, isAdmin: boolean) {
    try {
      const shipment = await prisma.shipment.findUnique({
        where: { id: shipmentId },
      });

      if (!shipment) {
        throw new Error('Shipment not found');
      }

      // Only admin or shipment owner can delete
      if (!isAdmin && shipment.userId !== userId) {
        throw new Error('Unauthorized to delete this shipment');
      }

      await prisma.shipment.delete({
        where: { id: shipmentId },
      });

      return { message: 'Shipment deleted successfully' };
    } catch (error) {
      console.error('Error deleting shipment:', error);
      throw error;
    }
  }

  /**
   * Get shipment statistics for dashboard
   */
  static async getShipmentStats(userId: string, isAdmin: boolean) {
    try {
      const whereClause = isAdmin ? {} : { userId };

      const [total, pending, inTransit, delivered, cancelled] = await Promise.all([
        prisma.shipment.count({ where: whereClause }),
        prisma.shipment.count({ where: { ...whereClause, status: 'pending' } }),
        prisma.shipment.count({ where: { ...whereClause, status: 'in_transit' } }),
        prisma.shipment.count({ where: { ...whereClause, status: 'delivered' } }),
        prisma.shipment.count({ where: { ...whereClause, status: 'cancelled' } }),
      ]);

      return {
        total,
        pending,
        inTransit,
        delivered,
        cancelled,
      };
    } catch (error) {
      console.error('Error fetching shipment stats:', error);
      throw new Error('Failed to fetch statistics');
    }
  }
}