import { Router } from 'express';
import { ShipmentController } from '../controllers/shipmentController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

/**
 * @route   GET /api/shipments/track/:trackingNumber
 * @desc    Track shipment by tracking number
 * @access  Public (no auth required for tracking)
 */
router.get('/track/:trackingNumber', ShipmentController.trackShipment);

// All routes below require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/shipments/stats
 * @desc    Get shipment statistics
 * @access  Private (authenticated users)
 */
router.get('/stats', ShipmentController.getStats);

/**
 * @route   POST /api/shipments
 * @desc    Create a new shipment
 * @access  Private (authenticated users)
 */
router.post('/', ShipmentController.createShipment);

/**
 * @route   GET /api/shipments
 * @desc    Get all shipments (user's shipments or all for admin)
 * @access  Private (authenticated users)
 */
router.get('/', ShipmentController.getShipments);

/**
 * @route   GET /api/shipments/:id
 * @desc    Get single shipment by ID
 * @access  Private (authenticated users)
 */
router.get('/:id', ShipmentController.getShipmentById);

/**
 * @route   PATCH /api/shipments/:id/status
 * @desc    Update shipment status
 * @access  Private (admin only)
 */
router.patch('/:id/status', isAdmin, ShipmentController.updateShipmentStatus);

/**
 * @route   DELETE /api/shipments/:id
 * @desc    Delete a shipment
 * @access  Private (admin or shipment owner)
 */
router.delete('/:id', ShipmentController.deleteShipment);

export default router;