import React from 'react';
import Image from 'next/image';

const steps = [
  {
    num: "01",
    color: "bg-purple-100 text-purple-600",
    title: "Floor Plan",
    desc: "Upload your Floor Plan (PDF/JPG), or Hand Sketch, or Walkthrough Video. The video should start from the main entrance and show the entire building.",
  },
  {
    num: "02",
    color: "bg-blue-100 text-blue-600",
    title: "Project Details",
    desc: "Provide your Project Address, Google Maps Link, and Building Name (if available).",
  },
  {
    num: "03",
    color: "bg-orange-100 text-orange-500",
    title: "Emergency Information",
    desc: "Share your country's Fire Emergency Number and any additional emergency contact (optional).",
  },
  {
    num: "04",
    color: "bg-emerald-100 text-emerald-600",
    title: "Company Logo",
    desc: "Upload your Company Logo (PNG, JPG, SVG, AI, etc.). If you don't have one, you can skip this step.",
  },
  {
    num: "05",
    color: "bg-rose-100 text-rose-500",
    title: "Safety Equipment",
    desc: "Mark the locations of Fire Extinguishers, Fire Alarm, Smoke Detectors, First Aid Kit, Emergency Exits, and Assembly Point + etc.",
  },
  {
    num: "06",
    color: "bg-amber-100 text-amber-500",
    title: "Additional Notes",
    desc: "Tell me about any special instructions, restricted areas, or other requirements for your project.",
  },
];

export default function RequirementsSection() {
  return (
    <section className="bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title */}
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
            WHAT I NEED FROM YOU
          </h2>

          {/* Right Decoration */}
          <div className="relative h-8 w-8 shrink-0">

            {/* Green Overlapping Circle */}
            <span className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />

            {/* Red Circle */}
            <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
          </div>
        </div>


      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 6 Steps List */}
        <div className="lg:col-span-6 space-y-3">
          {steps.map((step) => (
            <div 
              key={step.num}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className={`px-4 py-3 rounded-lg text-xl font-black ${step.color} shrink-0`}>
                {step.num}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{step.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Plans Gallery Showcase */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-3 bg-transparent p-1">
          {/* Column 1 */}
          <div className="space-y-3">
            <div className="relative h-44 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm transition-transform hover:scale-[1.01]">
              <Image src="/plans/plan1.png" alt="Fire Alarm Zone Plan" fill className="object-contain p-1" />
            </div>
            <div className="relative h-44 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm transition-transform hover:scale-[1.01]">
              <Image src="/plans/plan2.png" alt="Fire Alarm Zone Plan 2" fill className="object-contain p-1" />
            </div>
            <div className="relative h-44 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm transition-transform hover:scale-[1.01]">
              <Image src="/plans/plan3.png" alt="Fire Alarm Zone Plan 3" fill className="object-contain p-1" />
            </div>
            <div className="relative h-56 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm transition-transform hover:scale-[1.01]">
              <Image src="/plans/plan4.png" alt="Emergency Evacuation Plan" fill className="object-contain p-1" />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <div className="relative h-56 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm transition-transform hover:scale-[1.01]">
              <Image src="/plans/plan5.png" alt="Emergency Evacuation Plan 2" fill className="object-contain p-1" />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm transition-transform hover:scale-[1.01]">
              <Image src="/plans/plan6.png" alt="Emergency Evacuation Plan Vertical" fill className="object-contain p-1" />
            </div>
            <div className="relative h-44 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm transition-transform hover:scale-[1.01]">
              <Image src="/plans/plan7.png" alt="Fire Alarm Zone Plan 4" fill className="object-contain p-1" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}