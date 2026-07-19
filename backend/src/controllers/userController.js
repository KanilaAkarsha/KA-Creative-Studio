import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (admin)
export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: users,
  });
});

// @desc    Update a user's role or active status
// @route   PATCH /api/users/:id
// @access  Private (admin)
export const updateUser = asyncHandler(async (req, res) => {
  const { role, active } = req.body;

  if (req.params.id === req.user._id.toString() && (role || active === false)) {
    res.status(400);
    throw new Error('You cannot change your own role or deactivate your own account');
  }

  const update = {};
  if (role) update.role = role;
  if (typeof active === 'boolean') update.active = active;

  const user = await User.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({ success: true, data: user });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (admin)
export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({ success: true, data: {} });
});
