import mongoose, { Schema, model, models } from 'mongoose';

const RequirementImageSchema = new Schema(
  {
    imageUrl: { type: String, required: true },
    alt: { type: String, default: '' },
    position: { type: String, enum: ['left', 'right'], required: true },
    column: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    height: { type: String, default: 'h-[150px]' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const RequirementImage = models.RequirementImage || model('RequirementImage', RequirementImageSchema);
export default RequirementImage;