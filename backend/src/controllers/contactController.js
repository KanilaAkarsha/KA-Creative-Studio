import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import Contact from '../models/Contact.js';

// @desc    Start a new contact thread (requires login)
// @route   POST /api/contact
// @access  Private
export const submitContact = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map((e) => e.msg).join(', '));
  }

  const { service, message, preferredDate } = req.body;

  const contact = await Contact.create({
    user: req.user._id,
    name: req.user.name,
    email: req.user.email,
    service,
    preferredDate: preferredDate || undefined,
    messages: [{ sender: 'user', text: message }],
  });

  res.status(201).json({
    success: true,
    message: "Message sent successfully! I'll get back to you soon.",
    data: contact,
  });
});

// @desc    Get all contact threads belonging to the logged-in user
// @route   GET /api/contact/me
// @access  Private
export const getMyContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.status(200).json({ success: true, count: contacts.length, data: contacts });
});

// @desc    Get all contact threads (admin inbox)
// @route   GET /api/contact
// @access  Private (admin)
export const getContacts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [contacts, total] = await Promise.all([
    Contact.find().populate('user', 'name email').sort({ updatedAt: -1 }).skip(skip).limit(limit),
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

// @desc    Add a reply to a contact thread (admin replying, or the owning
//          customer following up)
// @route   POST /api/contact/:id/reply
// @access  Private (admin, or the thread's owning customer)
export const addReply = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map((e) => e.msg).join(', '));
  }

  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error('Contact thread not found');
  }

  const isOwner = contact.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to reply to this thread');
  }

  const sender = isAdmin ? 'admin' : 'user';
  contact.messages.push({ sender, text: req.body.text });
  contact.status = isAdmin ? 'replied' : 'new';
  await contact.save();

  res.status(201).json({ success: true, data: contact });
});

// @desc    Update a contact thread's status
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
    throw new Error('Contact thread not found');
  }

  res.status(200).json({ success: true, data: contact });
});