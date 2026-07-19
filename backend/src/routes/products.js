import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);

router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('slug').trim().notEmpty().withMessage('Slug is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('image').trim().notEmpty().withMessage('Image URL is required'),
  ],
  createProduct
);

router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
