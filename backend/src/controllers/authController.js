import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { verifyGoogleIdToken } from '../config/google.js';

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function sendAuthResponse(user, statusCode, res) {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map((e) => e.msg).join(', '));
  }

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password, role: 'customer' });
  sendAuthResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map((e) => e.msg).join(', '));
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.active) {
    res.status(403);
    throw new Error('This account has been deactivated. Please contact support.');
  }

  sendAuthResponse(user, 200, res);
});

// @desc    Log in or sign up with a Google ID token
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    res.status(400);
    throw new Error('Google credential is required');
  }

  let payload;
  try {
    payload = await verifyGoogleIdToken(credential);
  } catch {
    res.status(401);
    throw new Error('Invalid Google credential');
  }

  const { sub: googleId, email, name, picture } = payload;

  if (!email) {
    res.status(400);
    throw new Error('Google account has no email address');
  }

  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    if (!user.active) {
      res.status(403);
      throw new Error('This account has been deactivated. Please contact support.');
    }
    // Link a Google login to a pre-existing email/password account.
    if (!user.googleId) {
      user.googleId = googleId;
      if (picture) user.avatar = picture;
      await user.save();
    }
  } else {
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      googleId,
      avatar: picture,
      role: 'customer',
    });
  }

  sendAuthResponse(user, 200, res);
});

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
