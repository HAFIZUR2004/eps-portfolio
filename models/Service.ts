import mongoose, { Schema, model, models } from "mongoose";

const PackageSchema = new Schema(
  {
    price: { type: String, default: "" },
    title: { type: String, default: "" },
    desc: { type: String, default: "" },
    delivery: { type: String, default: "" },
  },
  { _id: false }
);

const FaqSchema = new Schema(
  {
    question: { type: String, default: "" },
    answer: { type: String, default: "" },
  },
  { _id: false }
);

const ServiceSchema = new Schema(
  {
    // =========================
    // Basic Information
    // =========================
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    rating: {
      type: String,
      default: "5.0",
    },

    reviewsCount: {
      type: String,
      default: "0",
    },

    // =========================
    // Images
    // =========================
    mainImage: {
      type: String,
      required: [true, "Main image is required"],
    },

    galleryImages: {
      type: [String],
      default: [],
    },

    recentWorks: {
      type: [String],
      default: [],
    },

    relevantImages: {
      type: [String],
      default: [],
    },

    // =========================
    // Gig Details
    // =========================
    aboutGig: {
      type: String,
      required: [true, "About Gig is required"],
    },

    whyWorkWithMe: {
      type: String,
      default: "",
    },

    // =========================
    // Packages
    // =========================
    basicPackage: {
      type: PackageSchema,
      default: {},
    },

    standardPackage: {
      type: PackageSchema,
      default: {},
    },

    premiumPackage: {
      type: PackageSchema,
      default: {},
    },

    // =========================
    // Seller Information
    // =========================
    sellerName: {
      type: String,
      default: "Hafizur Rahman",
      trim: true,
    },

    sellerRole: {
      type: String,
      default: "Full-Stack Developer",
      trim: true,
    },

    sellerImage: {
      type: String,
      default: "",
    },

    sellerBio: {
      type: String,
      default: "",
    },

    // =========================
    // FAQs
    // =========================
    faqs: {
      type: [FaqSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Service =
  models.Service || model("Service", ServiceSchema);

export default Service;