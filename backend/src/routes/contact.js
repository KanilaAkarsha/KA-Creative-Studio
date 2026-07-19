import { Router } from 'express';
import { body } from 'express-validator';
import { submitContact, getContacts, updateContactStatus } from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const SERVICES = [
  'Graphic Design',
  'UI/UX Design',
  'Web Development',
  'Photography',
  'Videography',
  'Branding',
];

router.post(
  '/',
  contactLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('service').isIn(SERVICES).withMessage('Please select a valid service'),
    body('message')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Message must be between 10 and 2000 characters'),
  ],
  submitContact
);

router.get('/', protect, authorize('admin'), getContacts);
router.patch('/:id', protect, authorize('admin'), updateContactStatus);

export default router;
