import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'refunded', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe'],
      default: 'stripe',
    },
    stripeCheckoutSessionId: {
      type: String,
      index: true,
    },
    stripePaymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Order', orderSchema);

