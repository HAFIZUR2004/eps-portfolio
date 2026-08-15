import mongoose, { Schema, model, models } from 'mongoose';

const FiverrReviewSchema = new Schema(
  {
    reviewSrc: { type: String, required: true }, // 👈 এখানে clientImage এর বদলে reviewSrc আছে কিনা নিশ্চিত করুন
  },
  { timestamps: true }
);

const FiverrReview = models.FiverrReview || model('FiverrReview', FiverrReviewSchema);
export default FiverrReview;