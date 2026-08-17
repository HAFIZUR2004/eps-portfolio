"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface ServiceItem {
  _id: string;
  title?: string;
  description?: string; // ✅ নতুন ফিল্ড
  category?: string;
  rating?: string | number;
  reviewsCount?: string | number;
  mainImage?: string;
  basicPackage?: {
    price?: string;
    delivery?: string;
  };
  sellerName?: string;
}

export default function OurSafetyServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");

        if (!res.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await res.json();

        if (data?.success && Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // শুধু প্রথম ৩টি service দেখাবে
  const displayServices = services.slice(0, 3);

  // =========================================================
  // TEXT TRUNCATE HELPER (২ লাইনে সীমাবদ্ধ)
  // =========================================================
  const truncateText = (text: string, maxLines = 2) => {
    if (!text) return "Professional Fire Evacuation Plan for Your Building";

    if (text.length <= 60) return text;

    const words = text.split(" ");
    let truncated = "";
    let lineCount = 0;
    let charCount = 0;

    for (const word of words) {
      if (charCount + word.length + 1 > 80 && lineCount >= 1) {
        truncated += "...";
        break;
      }
      truncated += word + " ";
      charCount += word.length + 1;
      if (charCount > 40 && lineCount === 0) lineCount++;
    }

    return truncated.trim();
  };

  // =========================================================
  // DESCRIPTION TRUNCATE (১ লাইন)
  // =========================================================
  const truncateDescription = (text: string) => {
    if (!text) return "Professional fire safety and evacuation planning services.";

    if (text.length <= 80) return text;

    return text.substring(0, 80) + "...";
  };

  return (
    <section className="bg-[#f7f5f2] px-4 py-16">
      <div className="mx-auto max-w-6xl">
        {/* =====================================================
            SECTION HEADING
        ====================================================== */}
        <div className="mb-10 flex items-center justify-center gap-4">
          {/* Left Decoration */}
          <div className="relative h-8 w-8 shrink-0">
            <span className="absolute left-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />

            <span className="absolute right-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
          </div>

          {/* Heading */}
          <h2 className="whitespace-nowrap text-3xl font-bold tracking-tight text-black md:text-4xl">
            Our Fire Safety Services
          </h2>

          {/* Right Decoration */}
          <div className="relative h-8 w-8 shrink-0">
            <span className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />

            <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
          </div>
        </div>

        {/* =====================================================
            SERVICES GRID
        ====================================================== */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* ================= LOADING ================= */}
          {loading ? (
            <>
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-[14px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                >
                  <div className="h-[220px] w-full animate-pulse bg-gray-200 sm:h-[230px]" />

                  <div className="space-y-4 px-5 pb-5 pt-4">
                    <div className="flex justify-between">
                      <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
                      <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
                    </div>

                    <div className="h-16 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-10 w-full animate-pulse rounded bg-gray-200" /> {/* Description skeleton */}

                    <div className="border-t border-dashed border-gray-200" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-11 w-11 animate-pulse rounded-full bg-gray-200" />
                        <div className="space-y-2">
                          <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                          <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="ml-auto h-3 w-10 animate-pulse rounded bg-gray-200" />
                        <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : displayServices.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-sm font-medium text-gray-500">
                No services found.
              </p>
            </div>
          ) : (
            /* ================= SERVICE CARDS ================= */
            displayServices.map((service) => (
              <Link
                key={service._id}
                href={`/services/${service._id}`}
                className="group block h-full"
              >
                <article
                  className="
                    flex
                    h-full
                    flex-col
                    overflow-hidden
                    rounded-[14px]
                    bg-white
                    shadow-[0_2px_12px_rgba(0,0,0,0.06)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)]
                  "
                >
                  {/* =================================================
                      SERVICE IMAGE
                  ================================================== */}
                  <div className="relative h-[220px] w-full shrink-0 overflow-hidden bg-[#d8d8d8] sm:h-[230px]">
                    <Image
                      src={service.mainImage || "/placeholder.jpg"}
                      alt={service.title || "Fire Safety Service"}
                      fill
                      sizes="
                        (max-width: 640px) 100vw,
                        (max-width: 1024px) 50vw,
                        33vw
                      "
                      className="
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-[1.04]
                      "
                    />
                  </div>

                  {/* =================================================
                      CARD BODY
                  ================================================== */}
                  <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                    {/* =================================================
                        CATEGORY + RATING
                    ================================================== */}
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span
                        className="
                          rounded-sm
                          bg-[#f1f1f1]
                          px-2
                          py-1
                          text-[11px]
                          font-medium
                          text-gray-700
                        "
                      >
                        {service.category || "Fire Safety Plan"}
                      </span>

                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <Star
                          size={16}
                          className="fill-[#F59E0B] text-[#F59E0B]"
                        />
                        <span className="text-[13px] font-semibold text-gray-700">
                          {service.rating ?? "5.0"}
                        </span>
                        <span className="text-[12px] text-gray-500">
                          ({service.reviewsCount ?? 0} Reviews)
                        </span>
                      </div>
                    </div>

                    {/* =================================================
                        SERVICE TITLE (Truncated)
                    ================================================== */}
                    <h3
                      className="
                        min-h-[50px]
                        text-[23px]
                        font-extrabold
                        leading-[1.35]
                        tracking-[-0.4px]
                        text-black
                        transition-colors
                        duration-200
                        group-hover:text-[#006A4E]
                        line-clamp-2
                        overflow-hidden
                        text-ellipsis
                      "
                      title={service.title || "Professional Fire Evacuation Plan for Your Building"}
                    >
                      {truncateText(service.title || "Professional Fire Evacuation Plan for Your Building")}
                    </h3>

                    {/* =================================================
                        ✅ SHORT DESCRIPTION (NEW)
                    ================================================== */}
                    <p
                      className="
                        mt-1
                        text-[13px]
                        leading-[1.5]
                        text-gray-600
                        line-clamp-2
                        overflow-hidden
                        text-ellipsis
                        min-h-[38px]
                      "
                      title={service.description || "Professional fire safety and evacuation planning services."}
                    >
                      {truncateDescription(service.description || "Professional fire safety and evacuation planning services.")}
                    </p>

                    {/* =================================================
                        DASHED DIVIDER
                    ================================================== */}
                    <div className="my-4 border-t border-dashed border-gray-300" />

                    {/* =================================================
                        SELLER + PRICE
                    ================================================== */}
                    <div className="mt-auto flex items-center justify-between gap-4">
                      {/* ================= SELLER ================= */}
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div
                          className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-full
                            bg-[#e5e5e5]
                            text-[11px]
                            font-bold
                            text-[#006A4E]
                          "
                        >
                          {service.sellerName
                            ? service.sellerName.trim().charAt(0).toUpperCase()
                            : "FS"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-bold leading-tight text-gray-900">
                            {service.sellerName || "Fire Safety Expert"}
                          </p>
                          <p className="mt-1 truncate text-[11px] font-medium leading-tight text-gray-600">
                            Code Compliant Designs
                          </p>
                        </div>
                      </div>

                      {/* ================= PRICE ================= */}
                      <div className="shrink-0 text-right">
                        <p className="text-[13px] font-bold text-black">
                          {service.basicPackage?.price
                            ? `$${service.basicPackage.price}`
                            : "$50"}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-gray-700">
                          {service.basicPackage?.delivery ||
                            "Delivery in 1–2 Days"}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>

        {/* =====================================================
            VIEW ALL SERVICES BUTTON
        ====================================================== */}
        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="
              inline-flex
              items-center
              justify-center
              rounded-md
              bg-black
              px-8
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-300
              hover:bg-[#006A4E]
              hover:shadow-md
            "
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}