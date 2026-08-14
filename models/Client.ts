import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  logoSrc: string;
  createdAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    logoSrc: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { strict: false } // অন্য কোনো পুরোনো ফিল্ড থাকলে validation error আটকাবে
);

// Mongoose Cache Issue এড়াতে মডেল রিক্রিয়েট
if (mongoose.models.Client) {
  delete mongoose.models.Client;
}

const Client = mongoose.model<IClient>('Client', ClientSchema);

export default Client;