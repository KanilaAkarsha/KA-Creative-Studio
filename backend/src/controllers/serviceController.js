import asyncHandler from 'express-async-handler';
import Service, { SERVICE_ICON_KEYS, SERVICE_COLOR_KEYS } from '../models/Service.js';

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ active: true }).sort({ order: 1, createdAt: 1 });
  res.status(200).json({ success: true, count: services.length, data: services });
});

// @desc    Get the allowed icon/color keys (for admin form dropdowns)
// @route   GET /api/services/meta
// @access  Public
export const getServiceMeta = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { icons: SERVICE_ICON_KEYS, colors: SERVICE_COLOR_KEYS } });
});

// @desc    Create a service
// @route   POST /api/services
// @access  Private (admin)
export const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, data: service });
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (admin)
export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.status(200).json({ success: true, data: service });
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (admin)
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.status(200).json({ success: true, data: {} });
});
