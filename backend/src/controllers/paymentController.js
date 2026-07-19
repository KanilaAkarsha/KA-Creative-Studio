import asyncHandler from 'express-async-handler';
import { stripe } from '../config/stripe.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Create a Stripe Checkout session for a product purchase
// @route   POST /api/payments/create-checkout-session
// @access  Private
export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('productId is required');
  }

  const product = await Product.findById(productId);
  if (!product || !product.active) {
    res.status(404);
    throw new Error('Product not found');
  }

  const clientUrl = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: req.user.email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            description: product.description,
            images: product.image ? [product.image] : undefined,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      productId: product._id.toString(),
      userId: req.user._id.toString(),
    },
    success_url: `${clientUrl}/account?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/?checkout=cancelled`,
  });

  // Record a pending order up front so the customer's history/admin view
  // shows the attempt even before the webhook confirms payment.
  await Order.create({
    user: req.user._id,
    product: product._id,
    title: product.title,
    price: product.price,
    status: 'pending',
    stripeCheckoutSessionId: session.id,
  });

  res.status(200).json({ success: true, url: session.url });
});

// @desc    Handle Stripe webhook events (checkout completion, failures)
// @route   POST /api/payments/webhook
// @access  Public (verified via Stripe signature)
export const handleStripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    console.error(`Stripe webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      await Order.findOneAndUpdate(
        { stripeCheckoutSessionId: session.id },
        {
          status: 'completed',
          stripePaymentIntentId: session.payment_intent,
        }
      );
      break;
    }
    case 'checkout.session.expired': {
      const session = event.data.object;
      await Order.findOneAndUpdate({ stripeCheckoutSessionId: session.id }, { status: 'failed' });
      break;
    }
    default:
      break;
  }

  res.status(200).json({ received: true });
});
