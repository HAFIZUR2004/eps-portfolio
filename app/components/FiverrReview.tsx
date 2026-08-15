'use client';

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface FiverrReviewData {
  _id: string;
  reviewSrc: string; 
}

export default function FiverrReview() {
  const [reviews, setReviews] = useState<FiverrReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/fiverr-review');
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const nextReview = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) =>
      prev === 0 ? reviews.length - 1 : prev - 1
    );
  };

  if (loading) return <div className="py-20 text-center text-slate-500 font-medium">Loading reviews...</div>;
  if (reviews.length === 0) return <div className="py-20 text-center text-slate-500 font-medium">No reviews uploaded yet from Dashboard.</div>;

  const item = reviews[currentIndex];

  return (
    <section className="w-full bg-gradient-to-r from-slate-50 via-red-50/30 to-red-50/50 py-16 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="mb-10 flex items-center justify-center gap-4">
              <div className="relative h-8 w-8 shrink-0">
                <span className="absolute left-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
                <span className="absolute right-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
              </div>
              <h2 className="whitespace-nowrap text-3xl font-bold tracking-tight text-black md:text-4xl">
                Our Fire Safety Services
              </h2>
              <div className="relative h-8 w-8 shrink-0">
                <span className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
                <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Real reviews from satisfied Fiverr clients.
            </p>
            <div className="pt-2">
              <p className="font-bold text-slate-900 text-base">
                {reviews.length}+ Projects Successfully Completed
              </p>
              <a href="/dashboard/fiverreview" className="inline-block mt-3 bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-2 rounded-md text-sm transition-colors">
                View Fiverr Reviews
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 relative flex items-center justify-center">
            <button 
              onClick={prevReview} 
              className="absolute -left-4 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md hover:bg-slate-50 transition"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm w-full max-w-xl my-2 relative min-h-[280px] flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-[300px] md:h-[350px]">
                {/* ⚠️ গোপন বিষয়: উপরের কোডে item.reviewSrc ব্যবহার করলেই হবে, কিন্তু ক্লাউডিনারির জন্য remotePatterns লাগবেই! */}
                <Image
                  src={item.reviewSrc}
                  alt="Fiverr Client Screenshot"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>

            <button 
              onClick={nextReview} 
              className="absolute -right-4 z-20 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:bg-slate-800 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}