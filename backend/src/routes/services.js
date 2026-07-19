import { Router } from 'express';
import { body } from 'express-validator';
import {
  getServices,
  getServiceMeta,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getServices);
router.get('/meta', getServiceMeta);

router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('longDescription').trim().notEmpty().withMessage('Long description is required'),
    body('startingPrice').trim().notEmpty().withMessage('Starting price is required'),
  ],
  createService
);

router.put('/:id', protect, authorize('admin'), updateService);
router.delete('/:id', protect, authorize('admin'), deleteService);

export default router;
