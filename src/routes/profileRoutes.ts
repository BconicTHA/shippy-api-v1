import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/', ProfileController.getProfile);

/**
 * @route   PATCH /api/profile
 * @desc    Update user profile (name, phone, address)
 * @access  Private
 */
router.patch('/', ProfileController.updateProfile);

export default router;