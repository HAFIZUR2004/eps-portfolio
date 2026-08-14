"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; // বাটনের জন্য Link ব্যবহার করা হয়েছে
import { Star } from "lucide-react";

interface ServiceItem {
  _id: string;
  title?: string;
  category?: string;
  rating?: string | number;
  reviewsCount?: string | number;
  mainImage?: string;
  basicPackage?: {
    price?: string;
    delivery?: string;
  };
  sellerName?: string;
  badgeText?: string;
}

export default function OurSafetyServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();

        if (data?.success && Array.isArray(data.services)) {
          setServices(data.services);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // শুধু প্রথম ৩টি সার্ভিস দেখাবে
  const displayServices = services.slice(0, 3);

  return (
    <section className="bg-[#f7f5f2] px-4 py-16">
      <div className="mx-auto max-w-6xl text-center">
        
        {/* ================= SECTION HEADING ================= */}
        <div className="mb-10 flex items-center justify-center gap-4">
          <div className="relative h-8 w-8 shrink-0">
            <span className="absolute left-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
            <span className="absolute right-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
          </div>

          <h2 className="whitespace-nowrap text-3xl font-bold tracking-tight text-black md:text-4xl">
            Our Fire Safety Services
          </h2>

          <div className="relative h-8 w-8 shrink-0">
            <span className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
            <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
          </div>
        </div>

        {/* ================= SERVICES GRID ================= */}
        <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full py-10 text-gray-500 text-sm">
              Loading services...
            </div>
          ) : displayServices.length === 0 ? (
            <div className="col-span-full py-10 text-gray-500 text-sm">
              No services found.
            </div>
          ) : (
            displayServices.map((service: ServiceItem) => (
              <div
                key={service._id}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* ================= IMAGE ================= */}
                <div className="relative h-56 w-full overflow-hidden bg-[#006A4E] p-2">
                  <Image
                    src={service.mainImage || "/placeholder.jpg"}
                    alt={service.title || "Service"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="rounded-md object-cover transition-transform duration-500 hover:scale-105"
                  />

                  {/* Language Badge */}
                  <div className="absolute left-4 top-4 z-10">
                    <span className="rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold tracking-wide text-[#006A4E] shadow-sm">
                      {service.badgeText || "ENGLISH LANGUAGE"}
                    </span>
                  </div>
                </div>

                {/* ================= CARD BODY ================= */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    {/* Category + Rating */}
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-gray-800">
                        {service.category || "Fire Safety Plan"}
                      </span>

                      <div className="flex shrink-0 items-center gap-1 text-sm font-medium text-amber-500">
                        <Star size={14} className="fill-amber-400 stroke-none" />
                        <span>{service.rating ?? "5.0"}</span>
                        <span className="text-xs text-gray-400">
                          ({service.reviewsCount ?? 0})
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-5 line-clamp-2 text-lg font-bold leading-snug text-gray-900">
                      {service.title || "Professional Fire Evacuation Plan"}
                    </h3>
                  </div>

                  {/* ================= CARD FOOTER ================= */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    {/* Expert Info */}
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#006A4E]/10 text-xs font-bold text-[#006A4E]">
                        {service.sellerName?.charAt(0) || "EPS"}
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight text-gray-800">
                          {service.sellerName || "Fire Safety Expert"}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-500">
                          Code Compliant Designs
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="block text-sm font-extrabold text-black">
                        {service.basicPackage?.price
                          ? `$${service.basicPackage.price}`
                          : "$50"}
                      </span>
                      <span className="block text-[10px] font-medium text-gray-500">
                        {service.basicPackage?.delivery || "Delivery in 1–2 Days"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ================= VIEW ALL BUTTON ================= */}
        <div className="mt-10">
          <Link
            href="/services"
            className="inline-block rounded-md bg-black px-8 py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-[#006A4E] hover:shadow-md"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}