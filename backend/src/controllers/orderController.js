import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

// @desc    Get the logged-in customer's order/download history
// @route   GET /api/orders/me
// @access  Private (customer)
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('product', 'title image downloadUrl category')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: orders.length, data: orders });
});

// @desc    Get a signed/mock download link for a purchased product
// @route   GET /api/orders/:id/download
// @access  Private (customer who owns the order)
export const getDownloadLink = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('product', 'downloadUrl title');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access this download');
  }

  if (order.status !== 'completed') {
    res.status(402);
    throw new Error('Payment has not completed for this order yet');
  }

  res.status(200).json({
    success: true,
    data: {
      title: order.product.title,
      downloadUrl: order.product.downloadUrl,
    },
  });
});

// @desc    Get all orders (admin overview)
// @route   GET /api/orders
// @access  Private (admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find()
      .populate('user', 'name email')
      .populate('product', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: orders,
  });
});
