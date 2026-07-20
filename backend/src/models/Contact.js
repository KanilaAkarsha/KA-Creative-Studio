import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: String,
            enum: ['user', 'admin'],
            required: true,
        },
        text: {
            type: String,
            required: [true, 'Message text is required'],
            trim: true,
            minlength: 1,
            maxlength: 2000,
        },
    },
    { timestamps: true }
);

const contactSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        service: {
            type: String,
            required: [true, 'Service is required'],
            enum: [
                'Graphic Design',
                'UI/UX Design',
                'Web Development',
                'Photography',
                'Videography',
                'Branding',
            ],
        },
        preferredDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['new', 'read', 'replied', 'archived'],
            default: 'new',
        },
        messages: {
            type: [messageSchema],
            default: [],
            validate: {
                validator: (arr) => arr.length > 0,
                message: 'A contact thread must have at least one message',
            },
        },
    },
    { timestamps: true }
);

contactSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Contact', contactSchema);