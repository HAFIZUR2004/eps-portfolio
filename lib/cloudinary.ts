import { v2 as cloudinary } from 'cloudinary';

// Cloudinary credentials validation
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY; // 👈 NEXT_PUBLIC তুলে দিন
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName) {
  throw new Error('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
}
if (!apiKey) {
  throw new Error('Missing CLOUDINARY_API_KEY');
}
if (!apiSecret) {
  throw new Error('Missing CLOUDINARY_API_SECRET');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export default cloudinary;