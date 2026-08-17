"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Star } from "lucide-react";

// --- FAQ Data ---
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: "01",
    question: "What is a fire evacuation plan?",
    answer:
      "A fire evacuation plan is a detailed diagram showing emergency exit routes, locations of fire safety equipment, and safety instructions to help occupants evacuate safely during a fire emergency.",
  },
  {
    id: "02",
    question: "Who needs an evacuation plan?",
    answer:
      "Commercial buildings, residential complexes, schools, hospitals, factories, and public venues require code-compliant evacuation plans to ensure occupant safety.",
  },
  {
    id: "03",
    question: "What information do you need to create an evacuation plan?",
    answer:
      "We need your floor plan (PDF, DWG, image, or hand sketch), project address, and the locations of fire safety equipment such as extinguishers, alarms, first aid kits, and assembly points.",
  },
  {
    id: "04",
    question: "How long does it take to complete an evacuation plan?",
    answer:
      "Typically, standard projects are delivered within 2–4 business days depending on the size and complexity of the floor plan.",
  },
  {
    id: "05",
    question: "Do your evacuation plans comply with international standards?",
    answer:
      "Yes, our designs follow OSHA, NFPA, ISO 23601, and local building safety codes to ensure full compliance.",
  },
];

// --- Testimonial Data ---
const testimonialData = [
  {
    id: 1,
    clientName: "Iqrarazla",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    rating: 5,
    timeAgo: "2 months ago",
    comment:
      "Sabbir was very responsive and understanding of what we needed. He was very patient with our changing needs and responded well to them. Edits were made promptly and exactly how we wanted them. Work was of an excellent standard.",
    price: "$100-$200",
    duration: "3 days",
    sellerResponse: "Thank you so much! It was a pleasure working with you.",
  },
];

export default function FAQAndTestimonials() {
  const [openFaq, setOpenFaq] = useState<string>("03"); // 03 is open by default like the image

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? "" : id);
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 font-sans">
      {/* ---------------- SECTION 1: FAQ ---------------- */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: 2x2 Image Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm">
              <Image
                src="/eva1.jpeg" // আপনার ইমেজের পাথ দিন
                alt="Evacuation Plan 1"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm">
              <Image
                src="/eva1.jpeg"
                alt="Evacuation Plan 2"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm">
              <Image
                src="/eva1.jpeg"
                alt="Evacuation Plan 3"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm">
              <Image
                src="/eva1.jpeg"
                alt="Evacuation Plan 4"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Side: Accordion */}
          <div className="lg:col-span-7">
            {/* Header */}
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
            Frequently Asked Questions

          </h2>

          {/* Right Decoration */}
          <div className="relative h-8 w-8 shrink-0">

            {/* Green Overlapping Circle */}
            <span className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />

            {/* Red Circle */}
            <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
          </div>
        </div>


            {/* Accordions */}
            <div className="space-y-3">
              {faqData.map((item) => {
                const isOpen = openFaq === item.id;
                return (
                  <div
                    key={item.id}
                    className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all duration-200 shadow-sm"
                  >
                    <button
                      onClick={() => toggleFaq(item.id)}
                      className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`w-8 h-8 flex items-center justify-center rounded-md font-semibold text-sm ${
                            isOpen
                              ? "bg-orange-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.id}
                        </span>
                        <span className="font-bold text-slate-800 text-sm md:text-base">
                          {item.question}
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-slate-600 text-sm border-t border-slate-100 pl-16">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 2: TESTIMONIALS ---------------- */}
     
    </div>
  );
}