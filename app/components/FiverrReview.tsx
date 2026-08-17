'use client';

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface FiverrReviewData {
  _id: string;
  clientImage?: string;
  reviewSrc?: string;
}

export default function FiverrReview() {
  const [reviews, setReviews] = useState<FiverrReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/fiverr-review');
        const data = await res.json();
        if (data.success) {
          setReviews(data.testimonials || data.reviews || []);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Auto-slide functionality (Every 3 seconds)
  useEffect(() => {
    if (reviews.length === 0 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [reviews.length, isHovered]);

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

  if (loading) return <div className="py-12 text-center text-slate-500 font-medium text-sm">Loading reviews...</div>;
  if (reviews.length === 0) return <div className="py-12 text-center text-slate-500 font-medium text-sm">No reviews uploaded yet from Dashboard.</div>;

  const item = reviews[currentIndex];
  const imageSrc = item?.clientImage || item?.reviewSrc || '';

  return (
    <section className="w-full bg-gradient-to-r from-slate-50 via-red-50/30 to-red-50/50 py-10 border-t border-slate-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Grid Gap কমিয়ে gap-8 থেকে gap-6 / gap-10 করা হয়েছে */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative h-7 w-7 shrink-0">
                <span className="absolute left-0 top-0 h-6 w-6 rounded-full bg-[#FF3B1D]" />
                <span className="absolute right-0 top-1 z-10 h-4 w-4 rounded-full bg-[#006A4E]" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
                Client Reviews
              </h2>
              <div className="relative h-7 w-7 shrink-0">
                <span className="absolute left-0 top-1 z-10 h-4 w-4 rounded-full bg-[#006A4E]" />
                <span className="absolute right-0 top-0 h-6 w-6 rounded-full bg-[#FF3B1D]" />
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed max-w-md">
              Real reviews from satisfied Fiverr clients who trusted us for accurate, professional, and code-compliant Fire Evacuation Plan services.
            </p>

            <div className="pt-1">
              <p className="font-semibold text-slate-900 text-sm">
                {reviews.length}+ Successful Reviews Captured
              </p>
            </div>

            <button className="mt-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all shadow-sm">
              View Fiverr Reviews
            </button>
          </div>

          {/* Right Image Slider Section */}
          <div 
            className="lg:col-span-7 flex items-center justify-center lg:justify-end"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Main Card Wrapper (বাটন সহ কন্টেইনার) */}
            <div className="relative w-full max-w-xl flex items-center">
              
              {/* Prev Button (Card-এর বাঁ পাশে পারফেক্টলি অ্যালাইন করা) */}
              <button 
                onClick={prevReview} 
                className="absolute -left-3 sm:-left-4 z-20 w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md hover:bg-slate-100 transition-transform active:scale-95"
                aria-label="Previous Review"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>

              {/* Image Container */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-2 sm:p-3 shadow-sm w-full overflow-hidden">
                <div className="relative w-full h-[220px] sm:h-[260px] md:h-[280px]">
                  {imageSrc ? (
                    <Image
                      key={currentIndex}
                      src={imageSrc}
                      alt="Fiverr Client Review Screenshot"
                      fill
                      className="object-contain rounded-xl transition-opacity duration-300"
                      sizes="(max-width: 768px) 100vw, 600px"
                      priority
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-xs font-medium">
                      No Image Found
                    </div>
                  )}
                </div>
              </div>

              {/* Next Button (Card-এর ডান পাশে পারফেক্টলি অ্যালাইন করা) */}
              <button 
                onClick={nextReview} 
                className="absolute -right-3 sm:-right-4 z-20 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md hover:bg-slate-800 transition-transform active:scale-95"
                aria-label="Next Review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}