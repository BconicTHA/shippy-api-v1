import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/dashboard/login', AuthController.login);

// Protected routes (require authentication)
router.post('/dashboard/refresh', authenticateToken, AuthController.refresh);
router.post('/dashboard/logout', authenticateToken, AuthController.logout);

export default router;