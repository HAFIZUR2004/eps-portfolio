import mongoose, { Schema, model, models } from "mongoose";

const PortfolioSchema = new Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    country: { type: String, default: "Global" },
    language: { type: String, default: "English" },
    orientation: { type: String, enum: ["portrait", "landscape"], default: "portrait" },
  },
  { timestamps: true }
);

export const Portfolio = models.Portfolio || model("Portfolio", PortfolioSchema);