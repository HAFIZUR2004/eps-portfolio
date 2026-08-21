"use client";

import React, { useState } from "react";
import { Plus, Trash2, Loader2, PackagePlus, HelpCircle, ImagePlus, X } from "lucide-react";
import { CldUploadButton, CloudinaryUploadWidgetResults } from "next-cloudinary";
import Image from "next/image";

export default function CreateServicePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    rating: "5.0",
    reviewsCount: "40",
    mainImage: "",
    gigGalleryImages: [""] as string[], // ✅ নাম পরিবর্তন করে gigGalleryImages রাখা হলো
    recentWorks: [""] as string[],
    aboutGig: "",
    whyWorkWithMe: "",

    // Packages
    basicPrice: "10",
    basicTitle: "Small Building Evacuation Plan",
    basicDesc: "Single Floor • Up to 1,000 sq. ft. Ideal for small offices...",
    basicDelivery: "1 Day Delivery",

    standardPrice: "25",
    standardTitle: "Medium Building Evacuation Plan",
    standardDesc: "Up to 2 Floors • Up to 2,500 sq. ft...",
    standardDelivery: "2 Day Delivery",

    premiumPrice: "50",
    premiumTitle: "Large Complex Evacuation Plan",
    premiumDesc: "Multi-story / Large Factory • Up to 5,000 sq. ft...",
    premiumDelivery: "3 Day Delivery",

    // Seller Info
    sellerName: "Sabbir Hossain",
    sellerRole: "Service provider",
    sellerImage: "",
    sellerBio: "",

    // Dynamic FAQs
    faqs: [
      { question: "Do you offer assistance after completion?", answer: "Yes, we provide post-delivery assistance." },
    ],
  });

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "eps_preset";

  // Safe Cloudinary Success Handlers
  const handleMainImageUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result?.info && typeof result.info !== "string" && result.info.secure_url) {
      const url = result.info.secure_url;
      setFormData((prev) => ({ ...prev, mainImage: url }));
    }
  };

  const handleGigGalleryImageUpload = (result: CloudinaryUploadWidgetResults, index: number) => {
    if (result?.info && typeof result.info !== "string" && result.info.secure_url) {
      const url = result.info.secure_url;
      setFormData((prev) => {
        const updated = [...prev.gigGalleryImages];
        updated[index] = url;
        return { ...prev, gigGalleryImages: updated };
      });
    }
  };

  const handleRecentWorksUpload = (result: CloudinaryUploadWidgetResults, index: number) => {
    if (result?.info && typeof result.info !== "string" && result.info.secure_url) {
      const url = result.info.secure_url;
      setFormData((prev) => {
        const updated = [...prev.recentWorks];
        updated[index] = url;
        return { ...prev, recentWorks: updated };
      });
    }
  };

  // Handle Gig Gallery Image Addition & Updates
  const handleAddGigGalleryImage = () => {
    setFormData((prev) => ({
      ...prev,
      gigGalleryImages: [...prev.gigGalleryImages, ""],
    }));
  };

  const handleGigGalleryImageChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.gigGalleryImages];
      updated[index] = value;
      return { ...prev, gigGalleryImages: updated };
    });
  };

  const handleRemoveGigGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gigGalleryImages: prev.gigGalleryImages.filter((_, i) => i !== index),
    }));
  };

  // Recent Works Handlers
  const handleAddRecentWorks = () => {
    setFormData((prev) => ({
      ...prev,
      recentWorks: [...prev.recentWorks, ""],
    }));
  };

  const handleRecentWorksChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.recentWorks];
      updated[index] = value;
      return { ...prev, recentWorks: updated };
    });
  };

  const handleRemoveRecentWorks = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      recentWorks: prev.recentWorks.filter((_, i) => i !== index),
    }));
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const handleFaqChange = (index: number, field: "question" | "answer", value: string) => {
    setFormData((prev) => {
      const updated = [...prev.faqs];
      updated[index][field] = value;
      return { ...prev, faqs: updated };
    });
  };

  const handleRemoveFaq = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.mainImage) {
      alert("Please upload or provide a Main Cover Image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Service created successfully!");
      } else {
        alert("Failed to create service.");
      }
    } catch (err) {
      console.error("Error creating service:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 text-slate-100">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <PackagePlus className="w-6 h-6 text-[#006A4E]" /> Add New Service Detail
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Fill in the details below to publish a new gig page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Basic Info */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-2">
            1. Basic Information
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Gig Title *
            </label>
            <input
              type="text"
              placeholder="e.g. We will design professional fire emergency evacuation plan..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#006A4E]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Rating
              </label>
              <input
                type="text"
                placeholder="5.0"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#006A4E]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Reviews Count
              </label>
              <input
                type="text"
                placeholder="40"
                value={formData.reviewsCount}
                onChange={(e) => setFormData({ ...formData, reviewsCount: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#006A4E]"
              />
            </div>
          </div>
        </div>

        {/* 2. Media & Gallery */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
          <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>2. Media & Gallery</span>
            <button
              type="button"
              onClick={handleAddGigGalleryImage}
              className="text-xs text-[#006A4E] hover:underline flex items-center gap-1 font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> Add Gig Gallery Image Field
            </button>
          </h2>

          {/* Main Cover Image Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Main Cover Image *
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Image URL (or use Cloudinary Upload)"
                value={formData.mainImage}
                onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-[#006A4E]"
              />
              <CldUploadButton
                uploadPreset={uploadPreset}
                onSuccess={handleMainImageUpload}
                className="w-full sm:w-auto bg-[#006A4E] hover:bg-[#00543e] text-white px-4 py-2.5 rounded-xl text-xs font-medium transition flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <ImagePlus className="w-4 h-4" /> Upload Main Image
              </CldUploadButton>
            </div>

            {formData.mainImage && (
              <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-slate-700 group mt-2">
                <Image
                  src={formData.mainImage}
                  alt="Main Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mainImage: "" })}
                  className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white p-1 rounded-full text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Gig Gallery Images Upload */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="block text-xs font-medium text-slate-300">
              Gig Gallery Images
            </label>
            {formData.gigGalleryImages.map((img, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Gig Gallery Image ${idx + 1} URL`}
                    value={img}
                    onChange={(e) => handleGigGalleryImageChange(idx, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#006A4E]"
                  />
                  <CldUploadButton
                    uploadPreset={uploadPreset}
                    onSuccess={(result) => handleGigGalleryImageUpload(result, idx)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <ImagePlus className="w-3.5 h-3.5" /> Upload
                  </CldUploadButton>

                  {formData.gigGalleryImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveGigGalleryImage(idx)}
                      className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {img && (
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-slate-700">
                    <Image
                      src={img}
                      alt={`Gig Gallery ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Relevant Image  */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">
                Relevant Image
              </label>
              <button
                type="button"
                onClick={handleAddRecentWorks}
                className="text-xs text-[#006A4E] hover:underline flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Add Recent Project Image
              </button>
            </div>
            
            {formData.recentWorks.map((img, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Recent Project Image ${idx + 1} URL`}
                    value={img}
                    onChange={(e) => handleRecentWorksChange(idx, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#006A4E]"
                  />
                  <CldUploadButton
                    uploadPreset={uploadPreset}
                    onSuccess={(result) => handleRecentWorksUpload(result, idx)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <ImagePlus className="w-3.5 h-3.5" /> Upload
                  </CldUploadButton>

                  {formData.recentWorks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRecentWorks(idx)}
                      className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {img && (
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-slate-700">
                    <Image
                      src={img}
                      alt={`Recent Project ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Package Pricing */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
          <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-2">
            3. Packages Setup
          </h2>

          {/* Basic Package */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Basic Package
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Price ($10)"
                value={formData.basicPrice}
                onChange={(e) => setFormData({ ...formData, basicPrice: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Title"
                value={formData.basicTitle}
                onChange={(e) => setFormData({ ...formData, basicTitle: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white sm:col-span-2"
              />
            </div>
            <textarea
              placeholder="Description..."
              value={formData.basicDesc}
              onChange={(e) => setFormData({ ...formData, basicDesc: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white h-16"
            />
          </div>

          {/* Standard Package */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Standard Package
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Price ($25)"
                value={formData.standardPrice}
                onChange={(e) => setFormData({ ...formData, standardPrice: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Title"
                value={formData.standardTitle}
                onChange={(e) => setFormData({ ...formData, standardTitle: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white sm:col-span-2"
              />
            </div>
            <textarea
              placeholder="Description..."
              value={formData.standardDesc}
              onChange={(e) => setFormData({ ...formData, standardDesc: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white h-16"
            />
          </div>
        </div>

        {/* 4. Details & FAQs */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-2">
            4. Details & FAQs
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              About this Gig
            </label>
            <textarea
              rows={4}
              placeholder="Detailed description of the service..."
              value={formData.aboutGig}
              onChange={(e) => setFormData({ ...formData, aboutGig: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[#006A4E]"
            />
          </div>

          {/* Dynamic FAQs */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions (FAQ)
              </label>
              <button
                type="button"
                onClick={handleAddFaq}
                className="text-xs text-[#006A4E] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add FAQ
              </button>
            </div>

            {formData.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 relative"
              >
                <input
                  type="text"
                  placeholder="Question..."
                  value={faq.question}
                  onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
                <textarea
                  placeholder="Answer..."
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white h-14"
                />
                {formData.faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx)}
                    className="absolute top-2 right-2 text-rose-400 p-1 hover:bg-rose-500/10 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#006A4E] text-white px-8 py-3 rounded-xl font-semibold text-xs hover:bg-[#00543e] transition flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Service...
              </>
            ) : (
              <>Publish Service</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}