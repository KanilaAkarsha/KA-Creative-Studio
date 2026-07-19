import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set — payment routes will fail until it is configured.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_not_configured', {
  apiVersion: '2024-06-20',
});
