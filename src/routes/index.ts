import { Router } from 'express';
import authRoutes from './authRoutes';
import shipmentRoutes from './shipmentRoutes';
import profileRoutes from './profileRoutes';

const router = Router();

// Health check
// router.get('/health', (req, res) => {
//   res.json({
//     status: 'success',
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//   });
// });


router.use('/auth', authRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/profile', profileRoutes);

export default router;
