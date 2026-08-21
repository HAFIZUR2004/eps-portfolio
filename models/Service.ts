import mongoose, { Schema, model, models } from "mongoose";

const PackageSchema = new Schema({
  price: { type: String, default: "" },
  title: { type: String, default: "" },
  desc: { type: String, default: "" },
  delivery: { type: String, default: "" },
});

const FaqSchema = new Schema({
  question: { type: String, default: "" },
  answer: { type: String, default: "" },
});

const ServiceSchema = new Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    rating: { type: String, default: "5.0" },
    reviewsCount: { type: String, default: "0" },
    mainImage: { type: String, required: [true, "Main image is required"] },
    galleryImages: [{ type: String }],
    aboutGig: { type: String, required: [true, "About Gig is required"] },
    whyWorkWithMe: { type: String, default: "" },

    // ✅ RECENT WORKS (আপনার প্রজেক্টের ইমেজগুলো এখানে সেভ হবে)
    recentWorks: [{ type: String }], 
    relevantImages: [String],
    // Packages (Optional Structure)
    basicPackage: { type: PackageSchema, default: {} },
    standardPackage: { type: PackageSchema, default: {} },
    premiumPackage: { type: PackageSchema, default: {} },

    // Seller Info
    sellerName: { type: String, default: "Hafizur Rahman" },
    sellerRole: { type: String, default: "Full-Stack Developer" },
    sellerImage: { type: String, default: "" },
    sellerBio: { type: String, default: "" },

    // Dynamic FAQs
    faqs: [FaqSchema],
  },
  { timestamps: true }
);

const Service = models.Service || model("Service", ServiceSchema);
export default Service;