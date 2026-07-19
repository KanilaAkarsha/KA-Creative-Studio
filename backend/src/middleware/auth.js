import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  let user;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    user = await User.findById(decoded.id).select('-password');
  } catch {
    res.status(401);
    throw new Error('Not authorized, token invalid or expired');
  }

  if (!user) {
    res.status(401);
    throw new Error('Not authorized, user no longer exists');
  }

  if (!user.active) {
    res.status(403);
    throw new Error('This account has been deactivated. Please contact support.');
  }

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error('Not authorized to access this resource');
  }
  next();
};
