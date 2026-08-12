"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "SL",
    country: "United Kingdom",
    initialBg: "bg-amber-600",
    rating: 5,
    time: "8 months ago",
    comment: "Fantastic customer service from Will, who's very patient and helpful. I will definitely book their service again in future.",
  },
  {
    id: 2,
    name: "Charles Luciano",
    country: "Saudi Arabia",
    initialBg: "bg-sky-600",
    rating: 5,
    time: "8 months ago",
    comment: "Just had Dustin from this company conduct a safety inspection. Very impressed with the service, he was efficient, thorough and professional.",
  },
  {
    id: 3,
    name: "Kanokphan Sirithepvattana",
    country: "Philippines",
    avatar: "/reviews/avatar1.jpg",
    rating: 5,
    time: "8 months ago",
    comment: "Will serviced our fire equipment in our massage parlour. Very friendly and happy to explain any questions we had. Thanks.",
  },
  {
    id: 4,
    name: "John Doe",
    country: "United States",
    initialBg: "bg-emerald-600",
    rating: 5,
    time: "6 months ago",
    comment: "Exceptional service and quick delivery of plans. Highly recommended for any safety compliance requirements!",
  },
];

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Carousel Controls
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 3 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= reviews.length - 3 ? 0 : prev + 1));
  };

  return (
    <section className="bg-[#FAF7F2] py-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto rounded-3xl my-8">
      
      {/* Title Header */}
       <div className="mb-10 flex items-center justify-center gap-4">

          {/* Left Decoration */}
          <div className="relative h-8 w-8 shrink-0">

            {/* Red Circle */}
            <span className="absolute left-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />

            {/* Green Overlapping Circle */}
            <span className="absolute right-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
          </div>

          {/* Heading */}
          <h2 className="whitespace-nowrap text-3xl font-bold tracking-tight text-black md:text-4xl">
            Trusted by Clients Worldwide
          </h2>

          {/* Right Decoration */}
          <div className="relative h-8 w-8 shrink-0">

            {/* Green Overlapping Circle */}
            <span className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />

            {/* Red Circle */}
            <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
          </div>
        </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Overall Rating Box */}
        <div className="lg:col-span-3 text-center lg:text-left flex flex-col items-center lg:items-start justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-extrabold tracking-wider text-gray-900 uppercase">
            EXCELLENT
          </h3>
          
          {/* Star Rating Icons */}
          <div className="flex items-center gap-1 my-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-emerald-500 p-1 rounded">
                <Star className="w-3.5 h-3.5 fill-white text-white" />
              </div>
            ))}
          </div>
          
          <p className="text-xs text-gray-500 font-medium">Based on 46 reviews</p>
          
          {/* Google Logo Brand Text */}
          <div className="mt-3 text-2xl font-bold tracking-tight flex items-center gap-0.5 select-none">
            <span className="text-blue-500">G</span>
            <span className="text-red-500">o</span>
            <span className="text-amber-500">o</span>
            <span className="text-blue-500">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">e</span>
          </div>
        </div>

        {/* Right: Reviews Cards Slider */}
        <div className="lg:col-span-9 relative">
          
          {/* Left Arrow Button */}
          <button 
            onClick={handlePrev}
            aria-label="Previous review" 
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white text-gray-700 rounded-full shadow-md items-center justify-center border border-gray-100 hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Cards Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
            {reviews.slice(currentIndex, currentIndex + 3).map((rev) => (
              <div 
                key={rev.id} 
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between text-left h-full transition-all duration-300 hover:shadow-md"
              >
                <div>
                  {/* Card Header: Avatar & Google Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {rev.avatar ? (
                        <div className="w-9 h-9 rounded-full relative overflow-hidden border border-gray-100 shrink-0">
                          <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className={`w-9 h-9 rounded-full ${rev.initialBg || 'bg-emerald-600'} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}>
                          {rev.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 leading-tight line-clamp-1">{rev.name}</h4>
                        <span className="text-[10px] text-gray-400 block">{rev.country}</span>
                      </div>
                    </div>
                    
                    {/* Google Icon Badge */}
                    <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-black flex items-center justify-center shrink-0 border border-blue-100">
                      G
                    </span>
                  </div>

                  {/* Rating & Date */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">{rev.time}</span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                    "{rev.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button 
            onClick={handleNext}
            aria-label="Next review" 
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white text-gray-700 rounded-full shadow-md items-center justify-center border border-gray-100 hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-95"
          >
            <ChevronRight size={20} />
          </button>

        </div>

      </div>
    </section>
  );
}