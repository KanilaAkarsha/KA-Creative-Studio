import { Router } from 'express';
import { body } from 'express-validator';
import {
  getApprovedReviews,
  createReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getApprovedReviews);

router.post(
  '/',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Review must be between 10 and 1000 characters'),
  ],
  createReview
);

router.get('/all', protect, authorize('admin'), getAllReviews);
router.patch('/:id', protect, authorize('admin'), updateReviewStatus);
router.delete('/:id', protect, authorize('admin'), deleteReview);

export default router;
