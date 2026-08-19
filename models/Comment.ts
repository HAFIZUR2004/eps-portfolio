// models/Comment.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
  userId: string;
  name: string;
  email?: string;
  avatar?: string;
  comment: string;
  rating: number;
  date: Date;
  isAuthorReply?: boolean;
  parentId?: mongoose.Types.ObjectId | string;
}

const CommentSchema = new Schema<IComment>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    avatar: { type: String, default: "https://via.placeholder.com/100" },
    comment: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    date: { type: Date, default: Date.now },
    isAuthorReply: { type: Boolean, default: false },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  { timestamps: true }
);

const CommentModel: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default CommentModel;