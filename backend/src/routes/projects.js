import { Router } from 'express';
import { body } from 'express-validator';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getProjects);

router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('image').trim().notEmpty().withMessage('Image URL is required'),
  ],
  createProject
);

router.put('/:id', protect, authorize('admin'), updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

export default router;
