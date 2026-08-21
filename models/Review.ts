import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  title: string;
  position: string;      // ✅ পদবি/Designation
  country: string;       // ✅ দেশ
  countryCode: string;   // ✅ দেশের কোড
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, default: '' },
    title: { type: String, required: true },
    position: { type: String, default: '' },     // ✅ নতুন
    country: { type: String, default: '' },       // ✅ নতুন
    countryCode: { type: String, default: '' },   // ✅ নতুন
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReviewSchema.index({ isApproved: 1, createdAt: -1 });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);