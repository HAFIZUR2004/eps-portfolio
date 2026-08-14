import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema({
  name: { type: String, required: true },
  avatar: { type: String },
  rating: { type: Number, default: 5 },
  text: { type: String, required: true },
  role: { type: String },
  isAuthorReply: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    tags: [{ type: String }],
    authorName: { type: String, default: "Admin" },
    authorRole: { type: String, default: "Author" },
    authorImage: { type: String },
    comments: [CommentSchema],
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Post || model("Post", PostSchema);