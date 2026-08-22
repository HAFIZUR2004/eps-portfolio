"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Loader2,
  Search,
} from "lucide-react";

interface PackageDetail {
  price?: string;
  delivery?: string;
}

interface Service {
  _id: string;
  category?: string;
  title?: string;
  aboutGig?: string;
  rating?: string | number;
  reviewsCount?: string | number;
  mainImage?: string;
  sellerName?: string;
  sellerImage?: string;  // ✅ Added
  sellerTagline?: string; // ✅ Added
  basicPackage?: PackageDetail;
  popular?: boolean;
  new?: boolean;
  trending?: boolean;
}

const categories: string[] = [
  "All",
  "Commercial Evacuation",
  "Residential Evacuation",
  "Industrial Safety",
  "3D & Isometric Maps",
  "Emergency Plans",
  "Fire Audit",
  "Site Diagrams",
];

export default function ServicePage(): React.ReactNode {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const res = await fetch("/api/services");

        if (!res.ok) {
          throw new Error("Failed to fetch data from API");
        }

        const data = await res.json();

        if (data?.success && Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          setServices([]);
        }
      } catch (error: unknown) {
        console.error("Failed to fetch services:", error);
        setFetchError("Service data could not be loaded right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices: Service[] = (services || []).filter((service) => {
    if (!service) return false;

    const matchesCategory =
      selectedCategory === "All" || service.category === selectedCategory;

    const titleMatch =
      service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const descMatch =
      service.aboutGig?.toLowerCase().includes(searchQuery.toLowerCase()) ??
      false;

    return matchesCategory && (searchQuery === "" || titleMatch || descMatch);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800 font-sans pb-20">
      {/* HEADER + FILTERS */}
      <section className="max-w-6xl mx-auto px-4 mt-10">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Explore Our Safety Services
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl text-center">
            Browse through our professional fire safety, evacuation, and
            emergency planning services tailored to your needs.
          </p>

          {/* Category Dropdown */}
          <div className="relative inline-block group w-full max-w-xs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-gray-200 text-gray-800 font-medium text-base pl-6 pr-10 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            <p className="text-gray-500 text-sm font-medium">
              Loading services...
            </p>
          </div>
        ) : fetchError ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100 shadow-sm">
            <p className="text-rose-600 font-medium text-base mb-3">
              {fetchError}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs bg-slate-900 text-white font-semibold px-5 py-2 rounded-xl hover:bg-slate-800 transition"
            >
              Reload Page
            </button>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-gray-600 font-medium text-lg">No services found.</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-full transition-all hover:scale-105"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service: Service) => {
              if (!service?._id) return null;

              return (
                <Link
                  href={`/services/${service._id}`}
                  key={service._id}
                  className="group block h-full"
                >
                  <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                    {/* IMAGE */}
                    <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-100 via-white to-slate-100 overflow-hidden border-b border-gray-100">
                      {/* Image */}
                      <div className="absolute inset-0 flex items-center justify-center p-2">
                        {service.mainImage ? (
                          <Image
                            src={service.mainImage}
                            alt={service.title || "Service"}
                            fill
                            className="
                              object-contain
                              p-2
                              transition-transform
                              duration-500
                              ease-out
                              group-hover:scale-[1.03]
                            "
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={false}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <span className="text-sm font-medium">No image available</span>
                          </div>
                        )}
                      </div>

                      {/* Soft overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />

                      {/* Popular */}
                      {service.popular && (
                        <span className="absolute top-3 left-3 z-10 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Popular
                        </span>
                      )}

                      {/* New */}
                      {service.new && (
                        <span className="absolute top-3 left-3 z-10 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          New
                        </span>
                      )}

                      {/* Trending */}
                      {service.trending && (
                        <span className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                          <ArrowRight className="w-3 h-3" />
                          Trending
                        </span>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* CATEGORY + RATING */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                          {service.category || "Safety Design"}
                        </span>
                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold">
                            {service.rating ?? "5.0"}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({service.reviewsCount ?? 0})
                          </span>
                        </div>
                      </div>

                      {/* TITLE */}
                      <h3 className="font-bold text-xl mb-1 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {service.title || "Untitled Service"}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="text-gray-500 text-sm line-clamp-2 mb-5 flex-1">
                        {service.aboutGig || "No description provided."}
                      </p>
                    </div>
                    <hr className="border-t border-dashed border-gray-300" />

                    {/* FOOTER (SELLER + PRICE) */}
                    <div className="px-6 pb-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        {/* Seller Avatar */}
                        <div className="flex-shrink-0">
                          <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 overflow-hidden ring-2 ring-white shadow-sm">
                            {service.sellerImage ? (
                              <Image
                                src={service.sellerImage}
                                alt={service.sellerName || "Seller"}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                {(service.sellerName || "S").charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Seller Info + Price */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-gray-900 truncate">
                                {service.sellerName || "Fire Safety Expert"}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {service.sellerTagline || "Code Compliant Designs"}
                              </p>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-gray-900 text-lg leading-tight">
                                {service.basicPackage?.price
                                  ? `$${service.basicPackage.price}`
                                  : "Custom"}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">
                                Delivery in {service.basicPackage?.delivery || "1-2 Days"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* CUSTOM ORDER BANNER */}
      <section className="max-w-6xl mx-auto px-4 mt-20">
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          {/* Decorative gradient blob */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold">
              Need a Custom Evacuation Plan?
            </h3>
            <p className="text-gray-300 text-base mt-2 max-w-lg">
              Send us your floor plan and get a personalized quote within hours.
            </p>
          </div>
          <Link
            href="/contact"
            className="relative z-10 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-emerald-500/30"
          >
            Request Custom Order
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}