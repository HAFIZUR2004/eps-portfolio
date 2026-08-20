import mongoose, { Schema, model, models } from 'mongoose';

const RequirementStepSchema = new Schema(
  {
    num: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    color: { type: String, default: 'bg-[#f3e8ff]' },
    textColor: { type: String, default: 'text-[#9333ea]' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const RequirementStep = models.RequirementStep || model('RequirementStep', RequirementStepSchema);
export default RequirementStep;