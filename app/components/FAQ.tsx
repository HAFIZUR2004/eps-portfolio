"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  _id: string;
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

interface FAQImage {
  _id: string;
  imageUrl: string;
  alt: string;
  position: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
  order: number;
  isActive: boolean;
}

export default function DynamicFAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [images, setImages] = useState<FAQImage[]>([]);
  const [openFaq, setOpenFaq] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQData();
  }, []);

  const fetchFAQData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/faq?type=all');
      if (!res.ok) {
        throw new Error('Failed to fetch FAQ data');
      }
      const data = await res.json();
      
      setFaqs(data.faqs || []);
      setImages(data.images || []);
      
      // Open first FAQ by default if available
      if (data.faqs && data.faqs.length > 0) {
        setOpenFaq(data.faqs[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching FAQ:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? "" : id);
  };

  // Get image by position
  const getImageByPosition = (position: string) => {
    return images.find(img => img.position === position && img.isActive);
  };

  if (loading) {
    return (
      <div className="w-full bg-white py-16 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#006A4E] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white py-16 text-center">
        <p className="text-red-600">Failed to load FAQ data</p>
        <button 
          onClick={fetchFAQData}
          className="mt-2 text-emerald-600 hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  const leftTopImage = getImageByPosition('left-top');
  const leftBottomImage = getImageByPosition('left-bottom');
  const rightTopImage = getImageByPosition('right-top');
  const rightBottomImage = getImageByPosition('right-bottom');

  return (
    <div className="w-full bg-white text-slate-800 font-sans">
      <section className="max-w-7xl mx-auto px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* LEFT SIDE - DYNAMIC IMAGE GRID */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="flex gap-[6px]">

              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-[6px]">

                {/* Top Left */}
                <div className="relative w-[185px] h-[185px] overflow-hidden rounded-tl-[32px] rounded-tr-md rounded-bl-md rounded-br-md border border-gray-100 shadow-sm">
                  {leftTopImage ? (
                    <Image
                      src={leftTopImage.imageUrl}
                      alt={leftTopImage.alt || "Evacuation Plan 1"}
                      fill
                      priority
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Bottom Left */}
                <div className="relative w-[185px] h-[185px] overflow-hidden rounded-tl-md rounded-tr-md rounded-bl-[32px] rounded-br-md border border-gray-100 shadow-sm">
                  {leftBottomImage ? (
                    <Image
                      src={leftBottomImage.imageUrl}
                      alt={leftBottomImage.alt || "Evacuation Plan 3"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col gap-[6px] pt-[16px]">

                {/* Top Right */}
                <div className="relative w-[185px] h-[185px] overflow-hidden rounded-tl-md rounded-tr-[32px] rounded-bl-md rounded-br-md border border-gray-100 shadow-sm">
                  {rightTopImage ? (
                    <Image
                      src={rightTopImage.imageUrl}
                      alt={rightTopImage.alt || "Evacuation Plan 2"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Bottom Right */}
                <div className="relative w-[185px] h-[185px] overflow-hidden rounded-tl-md rounded-tr-md rounded-bl-md rounded-br-[32px] border border-gray-100 shadow-sm">
                  {rightBottomImage ? (
                    <Image
                      src={rightBottomImage.imageUrl}
                      alt={rightBottomImage.alt || "Evacuation Plan 4"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT SIDE - DYNAMIC FAQ */}
          <div className="lg:col-span-7">

            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="relative flex items-center justify-center h-8 w-8 shrink-0">
                <span className="absolute left-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
                <span className="absolute right-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
              </div>

              <h2 className="text-[28px] md:text-4xl font-extrabold tracking-tight text-black text-center">
                Frequently Asked Questions
              </h2>

              <div className="relative flex items-center justify-center h-8 w-8 shrink-0">
                <span className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
                <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-[#6b7280] text-center text-[15px] mb-10 font-medium">
              Find answers to the most common questions about our evacuation plan services.
            </p>

            {/* FAQ Accordions */}
            <div className="space-y-3.5">
              {faqs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No FAQs available. Please add some from the dashboard.
                </div>
              ) : (
                faqs.map((item) => {
                  const isOpen = openFaq === item.id;

                  return (
                    <div
                      key={item._id}
                      className="border border-[#f3f4f6] rounded-xl bg-white overflow-hidden transition-all duration-200 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-md"
                    >
                      {/* Question */}
                      <button
                        type="button"
                        onClick={() => toggleFaq(item.id)}
                        className="w-full flex items-center justify-between p-4 pl-5 text-left focus:outline-none"
                      >
                        <div className="flex items-center gap-5">
                          <span
                            className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-lg font-bold text-sm transition-all duration-200 ${
                              isOpen
                                ? "bg-[#FF3B1D] text-white"
                                : "bg-[#f3f4f6] text-[#9ca3af]"
                            }`}
                          >
                            {item.id}
                          </span>
                          <span className="font-semibold text-[15px] text-[#1f2937]">
                            {item.question}
                          </span>
                        </div>
                        <div className="text-[#9ca3af] shrink-0 ml-4">
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </button>

                      {/* Answer */}
                      {isOpen && (
                        <div className="px-5 pb-4 pt-0.5 text-[#6b7280] text-[14px] leading-relaxed pl-[61px]">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}