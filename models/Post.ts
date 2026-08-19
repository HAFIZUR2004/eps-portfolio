import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      default: "Reader",
    },

    isAuthorReply: {
      type: Boolean,
      default: false,
    },

    parentId: {
      type: Schema.Types.ObjectId,
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    excerpt: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    tags: [
      {
        type: String,
      },
    ],

    authorName: {
      type: String,
      default: "Admin",
    },

    authorRole: {
      type: String,
      default: "Author",
    },

    authorImage: {
      type: String,
    },

    comments: {
      type: [CommentSchema],
      default: [],
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Post || model("Post", PostSchema);