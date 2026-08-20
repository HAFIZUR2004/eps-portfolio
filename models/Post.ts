import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: mongoose.Types.ObjectId;
  tags: string[];
  published: boolean;
  comments: {
    userId: string;
    name: string;
    email?: string;
    avatar?: string;
    comment: string; // ✅ Use 'comment' not 'text'
    rating: number;
    date: Date;
    isAuthorReply?: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: true },
    comments: [
      {
        userId: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String },
        avatar: { 
          type: String, 
          default: "https://ui-avatars.com/api/?name=User&background=006A4E&color=fff&size=100" 
        },
        comment: { type: String, required: true }, // ✅ 'comment'
        rating: { type: Number, min: 1, max: 5, default: 5 },
        date: { type: Date, default: Date.now },
        isAuthorReply: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);