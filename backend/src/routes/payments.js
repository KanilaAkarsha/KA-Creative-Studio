import { Router } from 'express';
import { createCheckoutSession } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Note: the webhook route itself is mounted separately in server.js with
// express.raw() applied BEFORE this router, since Stripe requires the raw
// request body to verify the signature.
router.post('/create-checkout-session', protect, createCheckoutSession);

export default router;
