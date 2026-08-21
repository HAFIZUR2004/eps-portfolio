'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';

export default function FireEvacuationHero() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // =========================================================
  // FETCH HERO IMAGES (Dashboard API)
  // =========================================================
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const res = await fetch('/api/hero', { cache: 'no-store' });

        if (!res.ok) {
          throw new Error('Failed to fetch hero images');
        }

        const data = await res.json();

        if (data.success) {
          setImages(data.data?.images || []);
        }
      } catch (error) {
        console.error('Failed to fetch hero images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  // =========================================================
  // AUTOMATIC SLIDER (প্রতি ৩ সেকেন্ডে ইমেজ পরিবর্তন)
  // =========================================================
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 3000); // ৩ সেকেন্ড

    return () => clearInterval(interval);
  }, [images.length]);

  // =========================================================
  // SLIDER CONTROLS (ম্যানুয়াল)
  // =========================================================
  const handleNext = () => {
    if (!images.length) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (!images.length) return;
    setActiveIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // =========================================================
  // LOADING STATE
  // =========================================================
  if (loading) {
    return (
      <section className="w-full bg-[#eee4de] py-20">
        <div className="flex items-center justify-center">
          <p className="text-sm font-medium text-slate-500">
            Loading hero images...
          </p>
        </div>
      </section>
    );
  }

  // =========================================================
  // NO IMAGES
  // =========================================================
  if (!images.length) {
    return (
      <section className="w-full bg-[#eee4de] py-20">
        <div className="flex items-center justify-center">
          <p className="text-sm font-medium text-slate-500">
            No hero images uploaded yet from Dashboard.
          </p>
        </div>
      </section>
    );
  }

  const currentImage = images[activeIndex];

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        px-4
        sm:px-8
        lg:px-12
        pt-10
        pb-10
        sm:pt-14
        sm:pb-14
        lg:pt-16
      "
      style={{
        background: 'linear-gradient(to bottom, #eee4de 89%, #F8F4F1 78%)',
      }}
    >
      <div className="mx-auto w-full max-w-[1200px]">

        {/* =====================================================
            HERO AREA
        ====================================================== */}
        <div
          className="
            relative
            min-h-[650px]
            sm:min-h-[700px]
            lg:min-h-[600px]
          "
        >

          {/* ===================================================
              LEFT WHITE CONTENT CARD
          ==================================================== */}
          <div
            className="
              absolute
              left-0
              top-[75px]
              z-10

              w-full
              lg:w-[59%]

              min-h-[380px]
              sm:min-h-[410px]
              lg:min-h-[385px]

              bg-white

              border-b-[4px]
              border-[#006A4E]

              px-7
              sm:px-10
              lg:px-10

              py-9
              sm:py-11

              flex
              items-center
            "
          >
            <div className="w-full max-w-[570px]">

              {/* Small text */}
              <span
                className="
                  mb-3
                  block
                  text-xs
                  font-semibold
                  tracking-wide
                  text-[#e53935]
                  sm:text-sm
                "
              >
                Professional Fire safety & evacuation planning specialists
              </span>

              {/* Heading */}
              <h1
                className="
                  text-[25px]
                  font-black
                  leading-[1.08]
                  tracking-tight
                  text-slate-950

                  sm:text-[28px]
                  lg:text-[20px]
                "
              >
                Professional Fire Safety &amp;
                <br />
                Evacuation Plan Design
              </h1>

              {/* Description */}
              <p
                className="
                  mt-5
                  max-w-[535px]
                  text-[11px]
                  leading-[1.55]
                  text-slate-500

                  sm:text-xs
                  lg:text-[12px]
                "
              >
                We create clear, professional, and standards-based Fire
                Evacuation Plans, Site Plans, <br/> Fire Alarm Zone Plans, and
                Safety Maps for residential, commercial, industrial, <br/>
                healthcare, and educational facilities. Fast delivery,
                unlimited revisions, <br/> and worldwide service.
              </p>

              {/* Buttons */}
              <div className="mt-5 flex flex-wrap items-center gap-3">

                {/* View Sample Plans */}
                <button
                  type="button"
                  className="
                    rounded-sm
                    bg-[#f04432]
                    px-5
                    py-2.5
                    text-xs
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:bg-[#dc3423]
                    hover:shadow-md
                    sm:text-sm
                  "
                >
                  View Sample Plans
                </button>

                {/* ✅ WhatsApp - Lucide Icon + Click to WhatsApp */}
                <a
                  href="https://wa.me/8801234567890" // 👈 আপনার নম্বর দিন
                  target="_blank"
                  rel="noreferrer"
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    font-semibold
                    text-[#25D366]
                    transition-opacity
                    hover:opacity-75
                    sm:text-sm
                  "
                >
                  <MessageCircle className="h-5 w-5 text-[#25D366]" />
                  WhatsApp
                </a>

              </div>
            </div>
          </div>


  {/* ===================================================
              GREEN OUTLINE BEHIND IMAGE
          ==================================================== */}
          <div
            className="
              absolute

              right-[9%]
              top-0

              z-0

              hidden

              h-[500px]
              w-[250px]

              border-4
              border-[#006A4E]

              lg:block

              xl:-right-[8%]
              xl:h-[400px]
              xl:w-[200px]
            "
          />


          {/* ===================================================
              LARGE HERO IMAGE (Slider) - রেসপনসিভ করা হয়েছে
          ==================================================== */}
          <div
            className="
              absolute

              right-0
              top-[45px]

              z-20

              h-[340px]
              w-[78%]

              overflow-hidden

              border
              border-slate-200

              bg-white

              shadow-[0_8px_25px_rgba(0,0,0,0.22)]

              sm:h-[400px]
              sm:w-[72%]

              lg:h-[420px]
              lg:w-[60%]

              xl:h-[440px]
              xl:w-[58%]

              2xl:h-[460px]
              2xl:w-[56%]
            "
          >
            {currentImage ? (
              <Image
                key={activeIndex}
                src={currentImage}
                alt={`Hero Image ${activeIndex + 1}`}
                fill
                priority={activeIndex === 0}
                className="
                  object-contain
                  transition-opacity
                  duration-500
                "
                sizes="
                  (max-width: 640px) 95vw,
                  (max-width: 1024px) 70vw,
                  700px
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                  text-sm
                  text-slate-400
                "
              >
                No Image Found
              </div>
            )}
          </div>

        </div>


        {/* =====================================================
            SLIDER CONTROLS + THUMBNAILS
        ====================================================== */}
        <div
          className="
            relative
            z-30

            -mt-[95px]

            flex
            flex-col
            items-center
            justify-center
            gap-5

            sm:-mt-[80px]

            lg:-mt-[75px]
            lg:flex-row
            lg:justify-center
            lg:gap-5
          "
        >

          {/* ===================================================
              NAVIGATION
          ==================================================== */}
          <div
            className="
              flex
              min-w-[185px]
              items-center
              justify-center
              gap-5

              bg-[#ddd2ca]

              px-5
              py-3
            "
          >

            {/* Previous */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="
                text-white
                transition-colors
                hover:text-slate-800
              "
            >
              <ArrowLeft className="h-4 w-4" />
            </button>


            {/* Numbers */}
            <div className="flex items-center gap-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`
                    text-xs
                    transition-all
                    duration-200

                    ${activeIndex === index
                      ? 'scale-110 font-black text-slate-950'
                      : 'font-semibold text-white hover:text-slate-700'
                    }
                  `}
                >
                  {String(index + 1).padStart(2, '0')}
                </button>
              ))}
            </div>


            {/* Next */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="
                text-white
                transition-colors
                hover:text-slate-800
              "
            >
              <ArrowRight className="h-4 w-4" />
            </button>

          </div>


          {/* ===================================================
              THUMBNAILS
          ==================================================== */}
          <div
            className="
              flex
              max-w-full
              items-center
              gap-3
              overflow-x-auto
              pb-2
            "
          >
            {images.map((imgUrl, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`
                  relative
                  h-[65px]
                  w-[105px]
                  shrink-0
                  overflow-hidden
                  rounded-sm
                  border
                  bg-white
                  transition-all
                  duration-200

                  sm:h-[75px]
                  sm:w-[120px]

                  ${activeIndex === index
                    ? `
                        border-[#006A4E]
                        shadow-md
                        ring-2
                        ring-[#006A4E]/20
                        scale-105
                      `
                    : `
                        border-slate-300
                        opacity-75
                        hover:opacity-100
                      `
                  }
                `}
              >
                <Image
                  src={imgUrl}
                  alt={`Hero thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </button>
            ))}
          </div>

        </div>


        {/* =====================================================
            BOTTOM WHITE PILL (STATS COUNTER)
        ====================================================== */}
        <div
          className="
            mx-auto
            mt-8

            h-[65px]

            w-[75%]

            rounded-full

            bg-white

            shadow-[0_5px_3px_rgba(0,0,0,0.12)]

            sm:mt-10
            sm:h-[75px]
            sm:w-[70%]

            lg:mt-8
            lg:w-[72%]

            flex
            items-center
            justify-around
            px-4
            sm:px-8
          "
        >
          {/* Stat 1 */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-base font-black text-slate-900 sm:text-xl lg:text-2xl">
              100+
            </span>
            <span className="text-[9px] font-semibold text-slate-700 sm:text-xs">
              Works Done
            </span>
          </div>

          {/* Divider */}
          <div className="h-6 w-[1px] bg-slate-900/20 sm:h-8" />

          {/* Stat 2 */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-base font-black text-slate-900 sm:text-xl lg:text-2xl">
              150+
            </span>
            <span className="text-[9px] font-semibold text-slate-700 sm:text-xs">
              Happy Clients
            </span>
          </div>

          {/* Divider */}
          <div className="h-6 w-[1px] bg-slate-900/20 sm:h-8" />

          {/* Stat 3 */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-base font-black text-slate-900 sm:text-xl lg:text-2xl">
              20+
            </span>
            <span className="text-[9px] font-semibold text-slate-700 sm:text-xs">
              Countries
            </span>
          </div>
        </div>


        
      </div>
    </section>
  );
}