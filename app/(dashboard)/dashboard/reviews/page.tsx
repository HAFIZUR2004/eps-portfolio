"use client";

import { useState } from "react";
import { Star, Check, Trash2, Globe, Clock } from "lucide-react";

// Demo Review Data Structure
const initialReviews = [
  {
    id: "1",
    clientName: "David Miller",
    country: "United States",
    rating: 5,
    comment: "Hafizur developed a top-notch web solution for our company. Extremely satisfied with his speed and quality!",
    status: "pending",
    date: "Aug 10, 2026",
  },
  {
    id: "2",
    clientName: "Sophie Taylor",
    country: "United Kingdom",
    rating: 5,
    comment: "Brilliant execution of our custom dashboard. His understanding of Next.js and UI animations is remarkable.",
    status: "approved",
    date: "Aug 08, 2026",
  },
  {
    id: "3",
    clientName: "Alex Rahman",
    country: "Canada",
    rating: 4,
    comment: "Great experience working together on our school application project.",
    status: "pending",
    date: "Aug 12, 2026",
  },
];

export default function ReviewManagement() {
  const [reviews, setReviews] = useState(initialReviews);

  const handleApprove = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Review Management</h2>
        <p className="text-xs text-slate-400 mt-1">
          Approve or delete reviews before they appear publicly on your portfolio.
        </p>
      </div>

      {/* Reviews Table / Cards */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md hover:border-slate-700/80 transition-all"
          >
            {/* Left Portion: Review Info */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h4 className="text-sm font-bold text-white">{review.clientName}</h4>
                
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  <Globe size={11} className="text-emerald-400" />
                  {review.country}
                </span>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    review.status === "approved"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1"
                  }`}
                >
                  {review.status === "pending" && <Clock size={10} />}
                  {review.status.toUpperCase()}
                </span>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={
                      i < review.rating
                        ? "fill-amber-400 stroke-none"
                        : "text-slate-700 fill-slate-700"
                    }
                  />
                ))}
              </div>

              {/* Comment Text */}
              <p className="text-slate-300 text-xs italic leading-relaxed">
                "{review.comment}"
              </p>
            </div>

            {/* Right Portion: Action Buttons */}
            <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
              {review.status === "pending" && (
                <button
                  onClick={() => handleApprove(review.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all"
                >
                  <Check size={14} /> Approve
                </button>
              )}

              <button
                onClick={() => handleDelete(review.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-xs hover:bg-red-500/20 transition-all"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}