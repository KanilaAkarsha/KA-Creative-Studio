import { Router } from 'express';
import { body } from 'express-validator';
import {
    submitContact,
    getMyContacts,
    getContacts,
    addReply,
    updateContactStatus,
} from '../controllers/contactController.js';
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
    protect,
    contactLimiter,
    [
        body('service').isIn(SERVICES).withMessage('Please select a valid service'),
        body('message')
            .trim()
            .isLength({ min: 10, max: 2000 })
            .withMessage('Message must be between 10 and 2000 characters'),
        body('preferredDate').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid date'),
    ],
    submitContact
);

router.get('/me', protect, getMyContacts);
router.get('/', protect, authorize('admin'), getContacts);

router.post(
    '/:id/reply',
    protect,
    contactLimiter,
    [body('text').trim().isLength({ min: 1, max: 2000 }).withMessage('Reply cannot be empty')],
    addReply
);

router.patch('/:id', protect, authorize('admin'), updateContactStatus);

export default router;