"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

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

export default function FAQAndTestimonials() {
  const [openFaq, setOpenFaq] = useState<string>("03");

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? "" : id);
  };

  return (
    <div className="w-full bg-white text-slate-800 font-sans">
      {/* ================= FAQ SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* =====================================================
              LEFT SIDE - STAGGERED IMAGE GRID
          ====================================================== */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="flex gap-[6px]">

              {/* ================= LEFT COLUMN ================= */}
              <div className="flex flex-col gap-[6px]">

                {/* Top Left */}
                <div
                  className="
                    relative
                    w-[185px]
                    h-[185px]
                    overflow-hidden
                    rounded-tl-[32px]
                    rounded-tr-md
                    rounded-bl-md
                    rounded-br-md
                    border border-gray-100
                    shadow-sm
                  "
                >
                  <Image
                    src="/eva1.jpeg"
                    alt="Evacuation Plan 1"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                {/* Bottom Left */}
                <div
                  className="
                    relative
                    w-[185px]
                    h-[185px]
                    overflow-hidden
                    rounded-tl-md
                    rounded-tr-md
                    rounded-bl-[32px]
                    rounded-br-md
                    border border-gray-100
                    shadow-sm
                  "
                >
                  <Image
                    src="/eva1.jpeg"
                    alt="Evacuation Plan 3"
                    fill
                    className="object-cover"
                  />
                </div>

              </div>

              {/* ================= RIGHT COLUMN ================= */}
              <div className="flex flex-col gap-[6px] pt-[16px]">

                {/* Top Right */}
                <div
                  className="
                    relative
                    w-[185px]
                    h-[185px]
                    overflow-hidden
                    rounded-tl-md
                    rounded-tr-[32px]
                    rounded-bl-md
                    rounded-br-md
                    border border-gray-100
                    shadow-sm
                  "
                >
                  <Image
                    src="/eva1.jpeg"
                    alt="Evacuation Plan 2"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Bottom Right */}
                <div
                  className="
                    relative
                    w-[185px]
                    h-[185px]
                    overflow-hidden
                    rounded-tl-md
                    rounded-tr-md
                    rounded-bl-md
                    rounded-br-[32px]
                    border border-gray-100
                    shadow-sm
                  "
                >
                  <Image
                    src="/eva1.jpeg"
                    alt="Evacuation Plan 4"
                    fill
                    className="object-cover"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE - FAQ
          ====================================================== */}
          <div className="lg:col-span-7">

            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-3">

              {/* Left Decoration */}
              <div className="relative flex items-center justify-center h-8 w-8 shrink-0">
                <span className="absolute left-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
                <span className="absolute right-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
              </div>

              <h2 className="text-[28px] md:text-4xl font-extrabold tracking-tight text-black text-center">
                Frequently Asked Questions
              </h2>

              {/* Right Decoration */}
              <div className="relative flex items-center justify-center h-8 w-8 shrink-0">
                <span className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
                <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
              </div>

            </div>

            {/* Subtitle */}
            <p className="text-[#6b7280] text-center text-[15px] mb-10 font-medium">
              Find answers to the most common questions about our evacuation
              plan services.
            </p>

            {/* FAQ Accordions */}
            <div className="space-y-3.5">

              {faqData.map((item) => {
                const isOpen = openFaq === item.id;

                return (
                  <div
                    key={item.id}
                    className="
                      border
                      border-[#f3f4f6]
                      rounded-xl
                      bg-white
                      overflow-hidden
                      transition-all
                      duration-200
                      shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]
                      hover:shadow-md
                    "
                  >

                    {/* Question */}
                    <button
                      type="button"
                      onClick={() => toggleFaq(item.id)}
                      className="
                        w-full
                        flex
                        items-center
                        justify-between
                        p-4
                        pl-5
                        text-left
                        focus:outline-none
                      "
                    >

                      <div className="flex items-center gap-5">

                        {/* Number */}
                        <span
                          className={`
                            w-9
                            h-9
                            shrink-0
                            flex
                            items-center
                            justify-center
                            rounded-lg
                            font-bold
                            text-sm
                            transition-all
                            duration-200
                            ${
                              isOpen
                                ? "bg-[#FF3B1D] text-white"
                                : "bg-[#f3f4f6] text-[#9ca3af]"
                            }
                          `}
                        >
                          {item.id}
                        </span>

                        {/* Question */}
                        <span className="font-semibold text-[15px] text-[#1f2937]">
                          {item.question}
                        </span>

                      </div>

                      {/* Arrow */}
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
                      <div
                        className="
                          px-5
                          pb-4
                          pt-0.5
                          text-[#6b7280]
                          text-[14px]
                          leading-relaxed
                          pl-[61px]
                        "
                      >
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
    </div>
  );
}