'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    title: 'EMERGENCY EVACUATION PLAN',
    img: '/evaimg1.png', 
  },
  {
    id: 2,
    title: 'FIRE ALARM ZONE PLAN',
    img: '/evaimg1.png',
  },
  {
    id: 3,
    title: 'SITE MAP EVACUATION',
    img: '/evaimg1.png',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="bg-[#f4f1eb] pt-16 pb-12 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* LEFT CONTENT */}
          <div className="w-full lg:w-1/2 relative z-10 flex flex-col justify-center">
            <p className="text-[#ff5722] font-semibold text-sm mb-2 uppercase tracking-wider">
              Fire safety and evacuation planning specialists
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] leading-tight mb-6">
              Professional Fire Safety & <br /> Evacuation Plan Design
            </h1>
            <p className="text-gray-600 text-base mb-8 max-w-lg leading-relaxed">
              We create clear, professional, and standards-based Fire Evacuation Plans, Site Plans, Fire Alarm Zone Plans, and Safety Maps for residential, commercial, industrial, healthcare, and educational facilities. Fast delivery, unlimited revisions, and worldwide service.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link 
                href="/portfolio"
                className="bg-[#ff5722] text-white font-semibold px-8 py-3 rounded shadow-md hover:bg-[#e64a19] transition duration-200"
              >
                View Sample Plans
              </Link>
              <Link 
                href="https://wa.me/your_number" 
                target="_blank"
                className="flex items-center gap-2 text-green-600 font-medium hover:underline"
              >
                <span className="text-xl">💬</span> WhatsApp
              </Link>
            </div>

            {/* সবুজ রেখা */}
            <div className="mt-10 w-full h-[3px] bg-[#2e7d32] rounded-full"></div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="w-full lg:w-1/2 relative flex flex-col items-center">
            {/* Main Image with Green Frame */}
            <div className="relative w-full max-w-xl">
              <div className="absolute -top-3 -right-3 w-full h-full border-[2px] border-[#2e7d32] rounded-xl z-0 bg-transparent pointer-events-none hidden sm:block"></div>
              
              <div className="relative z-10 bg-white p-2 rounded-xl shadow-xl w-full overflow-hidden border border-gray-200">
                <div className="w-full aspect-[4/3] relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src={slides[currentSlide].img}
                        alt={slides[currentSlide].title}
                        fill
                        className="object-contain rounded"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Thumbnails & Controls (Fixed Layout) */}
            <div className="mt-5 w-full max-w-xl flex justify-between items-center bg-[#e2dcd3] px-4 py-2.5 rounded-md shadow-inner">
              
              {/* Prev Button */}
              <button onClick={prevSlide} className="text-gray-600 hover:text-black transition p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              {/* Thumbnails */}
              <div className="flex items-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(index)}
                    className={`relative w-12 h-9 rounded border transition-all duration-200 overflow-hidden ${
                      index === currentSlide 
                        ? 'border-[#ff5722] opacity-100 scale-105 shadow-md ring-1 ring-[#ff5722]' 
                        : 'border-gray-400 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={slide.img} alt={`Thumb ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button onClick={nextSlide} className="text-gray-600 hover:text-black transition p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              {/* Counter (Fixed Dynamic Values) */}
              <div className="flex items-center text-xs font-mono text-gray-700 font-semibold gap-1 bg-white/60 px-2 py-1 rounded">
                 <span>{`0${currentSlide + 1}`}</span>
                 <span className="text-gray-400">/</span>
                 <span className="text-gray-400">{`0${slides.length}`}</span>
              </div>

            </div>
          </div>
        </div>
      </section>

     {/* ================= STATS BOX ================= */}
<div className="max-w-4xl mx-auto px-4 -mt-6 relative z-20 -mb-12">
  <div className="bg-white rounded-full shadow-lg shadow-black/5 border border-gray-100 py-2.5 px-6 md:px-10 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200/80 items-center">
    
    {/* 500+ Projects */}
    <div className="text-center px-3 py-1.5 sm:py-0">
      <span className="block text-2xl md:text-3xl font-extrabold text-[#1a1a1a] leading-none">
        500+
      </span>
      <span className="block mt-1 text-[11px] md:text-xs text-gray-500 font-medium tracking-wide">
        Projects Completed
      </span>
    </div>

    {/* 1000+ Clients */}
    <div className="text-center px-3 py-1.5 sm:py-0">
      <span className="block text-2xl md:text-3xl font-extrabold text-[#1a1a1a] leading-none">
        1000+
      </span>
      <span className="block mt-1 text-[11px] md:text-xs text-gray-500 font-medium tracking-wide">
        Clients
      </span>
    </div>

    {/* 20+ Countries */}
    <div className="text-center px-3 py-1.5 sm:py-0">
      <span className="block text-2xl md:text-3xl font-extrabold text-[#1a1a1a] leading-none">
        20+
      </span>
      <span className="block mt-1 text-[11px] md:text-xs text-gray-500 font-medium tracking-wide">
        Countries
      </span>
    </div>

  </div>
</div>
    </>
  );
}