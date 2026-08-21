"use client";

import React, { useEffect, useState } from "react";

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
  position: "left" | "right";
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
      setError(null);

      const res = await fetch("/api/requirements?type=all", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();

      setSteps(data.steps || []);
      setImages(data.images || []);
    } catch (err: any) {
      console.error("Requirements fetch error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <section className="w-full bg-[#fcfcfc] py-12">
        <div className="mx-auto flex min-h-[400px] max-w-[1400px] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#006A4E] border-t-transparent" />
        </div>
      </section>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <section className="w-full bg-[#fcfcfc] py-12">
        <div className="mx-auto max-w-[1400px] text-center">
          <p className="text-red-600">
            Failed to load requirements
          </p>

          <button
            onClick={fetchData}
            className="mt-3 text-emerald-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  /* =========================================================
     STEPS
  ========================================================= */

  const displaySteps =
    steps
      .filter((step) => step.isActive !== false)
      .sort((a, b) => a.order - b.order);

  /* =========================================================
     IMAGES
     
     Column 0:
     0 = top-left
     1 = middle-left
     2 = bottom-left

     Column 1:
     0 = top-right
     1 = middle-right
     2 = bottom-right
  ========================================================= */

  const leftImages = images
    .filter(
      (img) =>
        img.isActive !== false &&
        img.column === 0
    )
    .sort((a, b) => a.order - b.order);

  const rightImages = images
    .filter(
      (img) =>
        img.isActive !== false &&
        img.column === 1
    )
    .sort((a, b) => a.order - b.order);

  /* =========================================================
     IMAGE COMPONENT
  ========================================================= */

  const GalleryImage = ({
    image,
    className = "",
  }: {
    image?: ImageItem;
    className?: string;
  }) => {
    if (!image) {
      return (
        <div
          className={`flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white text-xs text-gray-400 ${className}`}
        >
          No Image
        </div>
      );
    }

    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-lg bg-white ${className}`}
      >
        <img
          src={image.imageUrl}
          alt={image.alt || "Requirement Image"}
          className="block h-full w-full object-contain"
          loading="lazy"
        />
      </div>
    );
  };

  return (
    <section className="w-full bg-[#fcfcfc] py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-7">

          {/* =====================================================
              LEFT SIDE
          ===================================================== */}

          <div className="lg:col-span-5">

            {/* HEADER */}

            <div className="mb-6">

              <div className="flex items-center gap-2 sm:gap-3">

                {/* LEFT DOT */}

                <div className="relative h-7 w-7 shrink-0">
                  <span className="absolute left-0 top-0 h-6 w-6 rounded-full bg-[#FF3B1D]" />

                  <span className="absolute right-0 top-1 z-10 h-4 w-4 rounded-full bg-[#006A4E]" />
                </div>

                <h2 className="text-[19px] font-extrabold tracking-tight text-black sm:text-[22px] md:text-3xl">
                  WHAT I NEED FROM YOU
                </h2>

                {/* RIGHT DOT */}

                <div className="relative h-7 w-7 shrink-0">
                  <span className="absolute left-0 top-1 z-10 h-4 w-4 rounded-full bg-[#006A4E]" />

                  <span className="absolute right-0 top-0 h-6 w-6 rounded-full bg-[#FF3B1D]" />
                </div>

              </div>

              <h3 className="mt-2 text-sm font-bold text-black sm:text-base md:text-lg">
                Create Your Fire Evacuation Plan in 6 Simple Steps
              </h3>

              <p className="mt-2 max-w-xl text-[11px] leading-relaxed text-gray-500 sm:text-xs">
                To design an accurate, professional, and code-compliant Fire
                Evacuation Plan, please provide the following information
                before we begin.
              </p>

            </div>

            {/* STEPS */}

            <div className="space-y-3">

              {displaySteps.map((step) => (
                <div
                  key={step._id}
                  className="
                    flex items-center gap-3
                    rounded-xl
                    border border-gray-100
                    bg-white
                    p-3
                    shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)]
                    transition-all
                    duration-200
                    hover:-translate-y-[1px]
                    hover:shadow-md
                    sm:gap-4
                    sm:p-3.5
                  "
                >

                  {/* NUMBER */}

                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      text-lg
                      font-black
                      sm:h-14
                      sm:w-14
                      sm:rounded-xl
                      sm:text-xl
                      ${step.color}
                      ${step.textColor}
                    `}
                  >
                    {step.num}
                  </div>

                  {/* TEXT */}

                  <div className="min-w-0 flex-1">

                    <h4 className="text-xs font-extrabold leading-tight text-gray-900 sm:text-sm">
                      {step.title}
                    </h4>

                    <p className="mt-1 text-[10px] leading-snug text-gray-400 sm:text-[11px]">
                      {step.description}
                    </p>

                  </div>

                </div>
              ))}

            </div>

          </div>


          {/* =====================================================
              RIGHT SIDE - EXACT IMAGE LAYOUT
          ===================================================== */}

          <div className="lg:col-span-7">

            <div
              className="
                grid
                grid-cols-[1.18fr_0.92fr]
                grid-rows-[135px_300px_190px]
                gap-2
                sm:gap-3
              "
            >

              {/* =================================================
                  TOP LEFT
              ================================================= */}

              <div className="flex items-center justify-center">
                <div className="h-full w-[72%]">
                  <GalleryImage
                    image={leftImages[0]}
                    className="h-full w-full"
                  />
                </div>
              </div>


              {/* =================================================
                  TOP RIGHT
              ================================================= */}

              <div className="flex items-center justify-center">
                <div className="h-full w-[88%]">
                  <GalleryImage
                    image={rightImages[0]}
                    className="h-full w-full"
                  />
                </div>
              </div>


              {/* =================================================
                  MIDDLE LEFT
              ================================================= */}

              <div className="flex items-center justify-center">
                <div className="h-full w-full">
                  <GalleryImage
                    image={leftImages[1]}
                    className="h-full w-full"
                  />
                </div>
              </div>


              {/* =================================================
                  MIDDLE RIGHT
                  TALL IMAGE
              ================================================= */}

              <div className="row-span-2 flex items-start justify-center">
                <div className="h-full w-full">
                  <GalleryImage
                    image={rightImages[1]}
                    className="h-full w-full"
                  />
                </div>
              </div>


              {/* =================================================
                  BOTTOM LEFT
              ================================================= */}

              <div className="flex items-start justify-center">
                <div className="h-full w-[72%]">
                  <GalleryImage
                    image={leftImages[2]}
                    className="h-full w-full"
                  />
                </div>
              </div>


              {/* =================================================
                  BOTTOM RIGHT

                  Because middle-right spans two rows,
                  this is placed in the second column
                  after the span.
              ================================================= */}

              <div className="flex items-start justify-center">
                <div className="h-full w-full">
                  <GalleryImage
                    image={rightImages[2]}
                    className="h-full w-full"
                  />
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}