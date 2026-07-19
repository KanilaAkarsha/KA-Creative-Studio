import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Get all active products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ active: true }).sort({ createdAt: 1 });
  res.status(200).json({ success: true, count: products.length, data: products });
});

// @desc    Get a single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.status(200).json({ success: true, data: product });
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.status(200).json({ success: true, data: product });
});

// @desc    Delete (deactivate) a product
// @route   DELETE /api/products/:id
// @access  Private (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.status(200).json({ success: true, data: product });
});
