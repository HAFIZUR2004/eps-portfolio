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
      <section className="w-full bg-gradient-to-r from-slate-50 via-red-50/30 to-red-50/50 py-16 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-4">
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
            Our Fire Safety Services
          </h2>

          {/* Right Decoration */}
          <div className="relative h-8 w-8 shrink-0">

            {/* Green Overlapping Circle */}
            <span className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />

            {/* Red Circle */}
            <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
          </div>
        </div>

              <p className="text-slate-500 text-sm leading-relaxed">
                Real reviews from satisfied Fiverr clients who trusted us for accurate, professional, and code-compliant Fire Evacuation Plan services.
              </p>
              
              <div className="pt-2">
                <p className="font-bold text-slate-900 text-base">
                  600+ Projects Successfully Completed
                </p>
                <button className="mt-3 bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-2 rounded-md text-sm transition-colors">
                  View Fiverr Reviews
                </button>
              </div>
            </div>

            {/* Right Content: Review Card with Carousel Controls */}
            <div className="lg:col-span-7 relative flex items-center justify-center">
              
              {/* Left Arrow Button */}
              <button className="absolute -left-4 z-10 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md hover:bg-slate-50 transition">
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>

              {/* Review Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm w-full max-w-xl my-2">
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-200 text-red-700 font-bold flex items-center justify-center text-sm">
                    I
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {testimonialData[0].clientName}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <span>{testimonialData[0].countryFlag}</span>{" "}
                      {testimonialData[0].country}
                    </p>
                  </div>
                </div>

                <hr className="my-4 border-slate-100" />

                {/* Rating & Date */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <div className="flex items-center gap-0.5 text-slate-900 font-bold">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-slate-900 text-slate-900"
                      />
                    ))}
                    <span className="ml-1">5</span>
                  </div>
                  <span>•</span>
                  <span>{testimonialData[0].timeAgo}</span>
                </div>

                {/* Comment */}
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-4">
                  "{testimonialData[0].comment}"
                </p>

                {/* Price & Duration */}
                <div className="flex items-center gap-8 text-xs py-2">
                  <div>
                    <span className="block text-slate-400 font-medium">Price</span>
                    <span className="font-bold text-slate-800">
                      {testimonialData[0].price}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-medium">Duration</span>
                    <span className="font-bold text-slate-800">
                      {testimonialData[0].duration}
                    </span>
                  </div>
                </div>

                <hr className="my-3 border-slate-100" />

                {/* Seller Response Accordion-style Footer */}
                <div className="flex items-center justify-between text-xs text-slate-600 pt-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-300 overflow-hidden relative">
                       {/* Placeholder Avatar */}
                       <div className="bg-slate-400 w-full h-full"></div>
                    </div>
                    <span className="font-semibold text-slate-700">Seller's Response</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Right Arrow Button */}
              <button className="absolute -right-4 z-10 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:bg-slate-800 transition">
                <ChevronRight className="w-5 h-5" />
              </button>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}