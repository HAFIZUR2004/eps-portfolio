import mongoose, { Schema, Document } from "mongoose";

export interface IRequirementStep extends Document {
  num: string;
  title: string;
  description: string;
  color: string;
  textColor: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRequirementImage extends Document {
  imageUrl: string;
  alt: string;
  position: 'left' | 'right';
  column: number;
  order: number;
  height: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Step Schema
const RequirementStepSchema = new Schema<IRequirementStep>(
  {
    num: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    color: { type: String, default: "bg-[#f3e8ff]" },
    textColor: { type: String, default: "text-[#9333ea]" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Image Schema
const RequirementImageSchema = new Schema<IRequirementImage>(
  {
    imageUrl: { type: String, required: true },
    alt: { type: String, default: "Requirement Image" },
    position: { type: String, enum: ['left', 'right'], required: true },
    column: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    height: { type: String, default: "h-[150px]" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const RequirementStep = mongoose.models.RequirementStep || 
  mongoose.model<IRequirementStep>("RequirementStep", RequirementStepSchema);

export const RequirementImage = mongoose.models.RequirementImage || 
  mongoose.model<IRequirementImage>("RequirementImage", RequirementImageSchema);