import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import Review from '../models/Review.js';

// @desc    Get approved reviews (public testimonials)
// @route   GET /api/reviews
// @access  Public
export const getApprovedReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 }).limit(30);
  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Submit a review (goes to "pending" for admin approval)
// @route   POST /api/reviews
// @access  Private (customer)
export const createReview = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map((e) => e.msg).join(', '));
  }

  const { rating, comment, role } = req.body;

  const existing = await Review.findOne({ user: req.user._id, status: { $in: ['pending', 'approved'] } });
  if (existing) {
    res.status(409);
    throw new Error('You already have a review submitted. Please wait for it to be reviewed.');
  }

  const review = await Review.create({
    user: req.user._id,
    name: req.user.name,
    role: role || '',
    avatar: req.user.avatar,
    rating,
    comment,
    status: 'pending',
  });

  res.status(201).json({
    success: true,
    message: 'Thanks for your review! It will appear once approved.',
    data: review,
  });
});

// @desc    Get all reviews regardless of status (admin moderation queue)
// @route   GET /api/reviews/all
// @access  Private (admin)
export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Approve, reject, or reset a review's status
// @route   PATCH /api/reviews/:id
// @access  Private (admin)
export const updateReviewStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  res.status(200).json({ success: true, data: review });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (admin)
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  res.status(200).json({ success: true, data: {} });
});
