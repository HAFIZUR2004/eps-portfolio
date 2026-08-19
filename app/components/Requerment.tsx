import React from 'react';
import Image from 'next/image';

const steps = [
  {
    num: "01",
    color: "bg-[#f3e8ff] text-[#9333ea]",
    title: "Floor Plan",
    desc: "Upload your Floor Plan (PDF/JPG), or Hand Sketch, or Walkthrough Video. The video should start from the main entrance and show the entire building.",
  },
  {
    num: "02",
    color: "bg-[#dbeafe] text-[#2563eb]",
    title: "Project Details",
    desc: "Provide your Project Address, Google Maps Link, and Building Name (if available).",
  },
  {
    num: "03",
    color: "bg-[#ffedd5] text-[#f97316]",
    title: "Emergency Information",
    desc: "Share your country's Fire Emergency Number and any additional emergency contact (optional).",
  },
  {
    num: "04",
    color: "bg-[#d1fae5] text-[#059669]",
    title: "Company Logo",
    desc: "Upload your Company Logo (PNG, JPG, SVG, AI, etc.). If you don't have one, you can skip this step.",
  },
  {
    num: "05",
    color: "bg-[#ffe4e6] text-[#f43f5e]",
    title: "Safety Equipment",
    desc: "Mark the locations of Fire Extinguishers, Fire Alarm, Smoke Detectors, First Aid Kit, Emergency Exits, and Assembly Point + etc.",
  },
  {
    num: "06",
    color: "bg-[#fef3c7] text-[#d97706]",
    title: "Additional Notes",
    desc: "Tell me about any special instructions, restricted areas, or other requirements for your project.",
  },
];

export default function RequirementsSection() {
  return (
    <section className="bg-[#fcfcfc] py-12 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          
          {/* Header Section */}
          <div className="mb-6">
            {/* Title with Red & Green Dots - Fixed Layout */}
            <div className="flex items-center gap-3 mb-2">
              {/* Left Decoration */}
              <div className="relative h-8 w-8 shrink-0">
                <span className="absolute left-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
                <span className="absolute right-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
              </div>

              {/* Heading */}
              <h2 className="text-[20px] font-bold tracking-tight text-black md:text-4xl">
                WHAT I NEED FROM YOU
              </h2>

              {/* Right Decoration */}
              <div className="relative h-8 w-8 shrink-0">
                <span className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
                <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
              </div>
            </div>

            {/* Subtitle */}
            <h3 className="text-base md:text-lg font-bold text-black mt-1">
              Create Your Fire Evacuation Plan in 6 Simple Steps
            </h3>

            {/* Paragraph */}
            <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-xl">
              To design an accurate, professional, and code-compliant Fire Evacuation Plan, please provide the following information before we begin.
            </p>
          </div>

          {/* 6 Steps Vertical Stack */}
          <div className="space-y-3">
            {steps.map((step) => (
              <div 
                key={step.num}
                className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-4 transition-all duration-200 hover:shadow-md"
              >
                {/* Number Box */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black ${step.color} shrink-0`}>
                  {step.num}
                </div>

                {/* Text Content */}
                <div className="pr-1">
                  <h4 className="text-sm font-extrabold text-gray-900 leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ================= RIGHT COLUMN (IMAGE GALLERY) ================= */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-3.5 pt-2">
          
          {/* Gallery Column 1 */}
          <div className="flex flex-col gap-3.5">
            {/* Plan 1 (Horizontal) */}
            <div className="relative h-[135px] sm:h-[150px] w-full bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden p-1.5">
              <Image src="/eva1.jpeg" alt="Fire Alarm Zone Plan 1" fill className="object-contain" />
            </div>

            {/* Plan 2 (Horizontal - Middle) */}
            <div className="relative h-[160px] sm:h-[180px] w-full bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden p-1.5">
              <Image src="/eva1.jpeg" alt="Fire Alarm Zone Plan 2" fill className="object-contain" />
            </div>

            {/* Plan 3 (Horizontal - Small) */}
            <div className="relative h-[125px] sm:h-[140px] w-full bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden p-1.5">
              <Image src="/eva1.jpeg" alt="Fire Alarm Zone Plan 3" fill className="object-contain" />
            </div>

            {/* Plan 4 (Vertical - Bottom) */}
            <div className="relative h-[190px] sm:h-[210px] w-full bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden p-1.5">
              <Image src="/eva1.jpeg" alt="Emergency Evacuation Plan 1" fill className="object-contain" />
            </div>
          </div>

          {/* Gallery Column 2 */}
          <div className="flex flex-col gap-3.5">
            {/* Plan 5 (Horizontal Top Right) */}
            <div className="relative h-[135px] sm:h-[150px] w-full bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden p-1.5">
              <Image src="/evaimg1.png" alt="Emergency Evacuation Plan 2" fill className="object-contain" />
            </div>

            {/* Plan 6 (Large Vertical Plan) */}
            <div className="relative h-[280px] sm:h-[310px] w-full bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden p-1.5">
              <Image src="/evaimg1.png" alt="Emergency Evacuation Plan Vertical" fill className="object-contain" />
            </div>

            {/* Plan 7 (Horizontal Bottom Right) */}
            <div className="relative h-[155px] sm:h-[175px] w-full bg-white rounded-xl border border-gray-200/90 shadow-sm overflow-hidden p-1.5">
              <Image src="/evaimg1.png" alt="Fire Alarm Zone Plan 4" fill className="object-contain" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}