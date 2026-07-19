import mongoose from 'mongoose';

const ICON_KEYS = ['Palette', 'Figma', 'Code2', 'Camera', 'Video', 'Crown', 'Sparkles', 'Layers', 'Rocket', 'Brush'];
const COLOR_KEYS = ['blue', 'purple', 'cyan', 'amber', 'rose', 'emerald', 'primary', 'accent'];

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    longDescription: {
      type: String,
      required: [true, 'Long description is required'],
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    startingPrice: {
      type: String,
      required: [true, 'Starting price is required'],
      trim: true,
    },
    icon: {
      type: String,
      enum: ICON_KEYS,
      default: 'Sparkles',
    },
    color: {
      type: String,
      enum: COLOR_KEYS,
      default: 'primary',
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

serviceSchema.index({ order: 1 });

export const SERVICE_ICON_KEYS = ICON_KEYS;
export const SERVICE_COLOR_KEYS = COLOR_KEYS;

export default mongoose.model('Service', serviceSchema);
