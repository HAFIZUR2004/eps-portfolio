import mongoose, { Schema, Document } from "mongoose";

export interface IFAQImage extends Document {
  imageUrl: string;
  alt: string;
  order: number;
  isActive: boolean;
  position: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
  createdAt: Date;
  updatedAt: Date;
}

const FAQImageSchema = new Schema<IFAQImage>(
  {
    imageUrl: { type: String, required: true },
    alt: { type: String, default: "FAQ Image" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    position: { 
      type: String, 
      enum: ['left-top', 'left-bottom', 'right-top', 'right-bottom'],
      required: true 
    },
  },
  { timestamps: true }
);

export default mongoose.models.FAQImage || mongoose.model<IFAQImage>("FAQImage", FAQImageSchema);