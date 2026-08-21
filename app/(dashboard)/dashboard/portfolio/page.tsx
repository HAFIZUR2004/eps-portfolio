"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, Plus, Loader2, ImagePlus, UploadCloud, CheckCircle2 } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";

interface PortfolioItem {
  _id: string;
  title: string;
  imageUrl: string;
  category: string;
  orientation: "portrait" | "landscape";
}

export default function PortfolioDashboard() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    category: "Fire Evacuation Plan",
    orientation: "portrait" as "portrait" | "landscape",
  });

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) {
      alert("Please upload an image and fill in all required fields!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({
          title: "",
          imageUrl: "",
          category: "Fire Evacuation Plan",
          orientation: "portrait",
        });
        fetchItems();
      } else {
        alert("Failed to add portfolio item.");
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert("Failed to delete item.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-2 md:p-6 max-w-7xl mx-auto space-y-8 text-slate-100">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Portfolio Manager</h1>
        <p className="text-xs text-slate-400">Upload and manage your portfolio items</p>
      </div>

      {/* Upload Form Section */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-md shadow-xl">
        <h2 className="text-base font-semibold text-slate-100 mb-6 flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-emerald-400" /> Add New Portfolio Image
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Title *</label>
            <input
              type="text"
              placeholder="e.g. Emergency Evacuation Plan 1"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              required
            />
          </div>

          {/* Cloudinary Image Upload Button */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Portfolio Image *</label>
            <div className="flex items-center gap-3">
              <CldUploadButton
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                  sources: ["local", "url"],
                  clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                  maxFileSize: 10000000,
                  multiple: false,
                }}
                onSuccess={(result) => {
                  const info = result?.info as { secure_url?: string };
                  if (info?.secure_url) {
                    setForm((prev) => ({ ...prev, imageUrl: info.secure_url! }));
                  }
                }}
                className="w-full border-2 border-dashed border-slate-700 hover:border-emerald-500 bg-slate-950 rounded-xl py-2 px-4 flex items-center justify-center gap-2 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                <span>{form.imageUrl ? "Change Image" : "Upload Image"}</span>
              </CldUploadButton>

              {form.imageUrl && (
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-emerald-500/50 shrink-0">
                  <Image src={form.imageUrl} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>
            {form.imageUrl && (
              <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Image Uploaded!
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
            >
              <option value="Fire Evacuation Plan" className="bg-slate-900 text-slate-200">Fire Evacuation Plan</option>
              <option value="Fire Alarm Zone Plan" className="bg-slate-900 text-slate-200">Fire Alarm Zone Plan</option>
              <option value="Fire Zone Block Plan" className="bg-slate-900 text-slate-200">Fire Zone Block Plan</option>
              <option value="Fire Hydrant Block Plan" className="bg-slate-900 text-slate-200">Fire Hydrant Block Plan</option>
              <option value="Floor Plan Redesign" className="bg-slate-900 text-slate-200">Floor Plan Redesign</option>
              <option value="Others" className="bg-slate-900 text-slate-200">Others</option>
            </select>
          </div>

          {/* Orientation */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Orientation *</label>
            <select
              value={form.orientation}
              onChange={(e) =>
                setForm({ ...form, orientation: e.target.value as "portrait" | "landscape" })
              }
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
            >
              <option value="portrait" className="bg-slate-900 text-slate-200">Portrait (Vertical)</option>
              <option value="landscape" className="bg-slate-900 text-slate-200">Landscape (Horizontal)</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !form.imageUrl}
              className="bg-emerald-500 text-slate-950 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-emerald-400 transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-slate-950" /> Add Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Items List */}
      <div>
        <h2 className="text-base font-semibold text-slate-100 mb-4">
          All Uploaded Items ({items.length})
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-xs text-slate-400">
            No portfolio items added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg relative group transition hover:border-slate-700"
              >
                <div className="relative h-48 w-full bg-slate-950">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-3.5 flex items-center justify-between bg-slate-900">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-100 truncate max-w-[150px]">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.category}</p>
                  </div>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}