import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import Contact from '../models/Contact.js';

// @desc    Submit the contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map((e) => e.msg).join(', '));
  }

  const { name, email, service, message } = req.body;

  const contact = await Contact.create({ name, email, service, message });

  res.status(201).json({
    success: true,
    message: "Message sent successfully! I'll get back to you soon.",
    data: {
      id: contact._id,
      createdAt: contact.createdAt,
    },
  });
});

// @desc    Get all contact form submissions
// @route   GET /api/contact
// @access  Private (admin)
export const getContacts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [contacts, total] = await Promise.all([
    Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Contact.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    count: contacts.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: contacts,
  });
});

// @desc    Update a contact submission's status
// @route   PATCH /api/contact/:id
// @access  Private (admin)
export const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!contact) {
    res.status(404);
    throw new Error('Contact submission not found');
  }

  res.status(200).json({ success: true, data: contact });
});
