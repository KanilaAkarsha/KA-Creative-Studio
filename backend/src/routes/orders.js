import { Router } from 'express';
import { getMyOrders, getDownloadLink, getAllOrders } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/me', protect, getMyOrders);
router.get('/:id/download', protect, getDownloadLink);
router.get('/', protect, authorize('admin'), getAllOrders);

export default router;
