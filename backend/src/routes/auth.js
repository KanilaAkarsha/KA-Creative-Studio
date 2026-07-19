import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, googleLogin, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.post(
  '/google',
  authLimiter,
  [body('credential').notEmpty().withMessage('Google credential is required')],
  googleLogin
);

router.get('/me', protect, getMe);

export default router;
