import mongoose from 'mongoose';

const HeroImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// মডেলটি ইতিমধ্যে থাকলে পুনরায় তৈরি করবেন না
const HeroImage = mongoose.models.HeroImage || mongoose.model('HeroImage', HeroImageSchema);

export default HeroImage;