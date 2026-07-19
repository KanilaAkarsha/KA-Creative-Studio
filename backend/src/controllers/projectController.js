import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';

// @desc    Get all active projects
// @route   GET /api/projects
// @access  Public
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ active: true }).sort({ order: 1, createdAt: -1 });
  res.status(200).json({ success: true, count: projects.length, data: projects });
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (admin)
export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project });
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (admin)
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  res.status(200).json({ success: true, data: project });
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (admin)
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  res.status(200).json({ success: true, data: {} });
});
