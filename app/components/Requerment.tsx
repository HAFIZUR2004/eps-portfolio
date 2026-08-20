"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Step {
  _id: string;
  num: string;
  title: string;
  description: string;
  color: string;
  textColor: string;
  order: number;
  isActive: boolean;
}

interface ImageItem {
  _id: string;
  imageUrl: string;
  alt: string;
  position: 'left' | 'right';
  column: number;
  order: number;
  height: string;
  isActive: boolean;
}

export default function DynamicRequirements() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/requirements?type=all');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      console.log('Fetched data:', data);
      setSteps(data.steps || []);
      setImages(data.images || []);
    } catch (error: any) {
      console.error('Error fetching requirements:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ফিক্স: column বা position অনুযায়ী গ্রুপিং
  const leftColumnImages = images.filter(img => img.column === 0);
  const rightColumnImages = images.filter(img => img.column === 1);

  // অথবা position অনুযায়ী:
  // const leftColumnImages = images.filter(img => img.position === 'left');
  // const rightColumnImages = images.filter(img => img.position === 'right');

  console.log('Left Images:', leftColumnImages);
  console.log('Right Images:', rightColumnImages);

  if (loading) {
    return (
      <section className="bg-[#fcfcfc] py-12 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#006A4E] border-t-transparent"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#fcfcfc] py-12 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load requirements</p>
          <button 
            onClick={fetchData}
            className="mt-2 text-emerald-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  const displaySteps = steps.length > 0 ? steps : [
    { _id: '1', num: '01', title: 'Floor Plan', description: 'Upload your Floor Plan (PDF/JPG), or Hand Sketch...', color: 'bg-[#f3e8ff]', textColor: 'text-[#9333ea]', order: 1, isActive: true },
    { _id: '2', num: '02', title: 'Project Details', description: 'Provide your Project Address, Google Maps Link...', color: 'bg-[#dbeafe]', textColor: 'text-[#2563eb]', order: 2, isActive: true },
  ];

  return (
    <section className="bg-[#fcfcfc] py-12 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative h-8 w-8 shrink-0">
                <span className="absolute left-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
                <span className="absolute right-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
              </div>
              <h2 className="text-[20px] font-bold tracking-tight text-black md:text-4xl">
                WHAT I NEED FROM YOU
              </h2>
              <div className="relative h-8 w-8 shrink-0">
                <span className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
                <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
              </div>
            </div>
            <h3 className="text-base md:text-lg font-bold text-black mt-1">
              Create Your Fire Evacuation Plan in 6 Simple Steps
            </h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-xl">
              To design an accurate, professional, and code-compliant Fire Evacuation Plan, 
              please provide the following information before we begin.
            </p>
          </div>

          {/* Dynamic Steps */}
          <div className="space-y-3">
            {displaySteps.map((step) => (
              <div 
                key={step._id}
                className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-4 transition-all duration-200 hover:shadow-md"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black ${step.color} ${step.textColor} shrink-0`}>
                  {step.num}
                </div>
                <div className="pr-1">
                  <h4 className="text-sm font-extrabold text-gray-900 leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN - Dynamic Images */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-3.5 pt-2">
          
          {/* Column 0 - Left Images */}
          <div className="flex flex-col gap-3.5">
            {leftColumnImages.length > 0 ? (
              leftColumnImages.map((img) => (
                <div 
                  key={img._id}
                  className={`relative w-full bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden p-1.5 ${img.height || 'h-[150px]'}`}
                >
                  <div className="relative w-full h-full">
                    <Image 
                      src={img.imageUrl} 
                      alt={img.alt || "Requirement Image"} 
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={(e) => {
                        console.error('Image load error:', e);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="relative h-[150px] w-full bg-gray-100 rounded-xl border border-gray-200/90 shadow-sm overflow-hidden p-1.5 flex items-center justify-center text-gray-400 text-sm">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl">🖼️</span>
                  <span>No images in column 0</span>
                </div>
              </div>
            )}
          </div>

          {/* Column 1 - Right Images */}
          <div className="flex flex-col gap-3.5">
            {rightColumnImages.length > 0 ? (
              rightColumnImages.map((img) => (
                <div 
                  key={img._id}
                  className={`relative w-full bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden p-1.5 ${img.height || 'h-[150px]'}`}
                >
                  <div className="relative w-full h-full">
                    <Image 
                      src={img.imageUrl} 
                      alt={img.alt || "Requirement Image"} 
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={(e) => {
                        console.error('Image load error:', e);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="relative h-[150px] w-full bg-gray-100 rounded-xl border border-gray-200/90 shadow-sm overflow-hidden p-1.5 flex items-center justify-center text-gray-400 text-sm">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl">🖼️</span>
                  <span>No images in column 1</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}