"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Search, ShieldCheck, Clock, ArrowRight } from "lucide-react";

// --- Types ---
interface Service {
  id: string;
  category: string;
  title: string;
  description: string;
  rating: number;
  reviewsCount: number;
  imageSrc: string;
  providerName: string;
  providerBadge: string;
  avatarText: string;
  price: string;
  deliveryTime: string;
  popular?: boolean;
}

// --- Evacuation Specific & Related Categories ---
const categories = [
  "All",
  "Commercial Evacuation",
  "Residential Evacuation",
  "Industrial & Factory Safety",
  "3D & Isometric Maps",
  "Emergency Action Plans",
  "Fire Safety Audit & Compliance",
  "Site Plan & Exit Diagrams",
];

// --- Comprehensive Services Data ---
const allServices: Service[] = [
  {
    id: "1",
    category: "Commercial Evacuation",
    title: "Professional Fire Evacuation Plan for Commercial Buildings",
    description: "OSHA & NFPA compliant emergency exit maps for offices, shopping malls, and corporate towers.",
    rating: 5.0,
    reviewsCount: 142,
    imageSrc: "/service-1.jpg",
    providerName: "Fire Safety Expert",
    providerBadge: "Code Compliant Designs",
    avatarText: "EPS",
    price: "$50",
    deliveryTime: "Delivery in 1–2 Days",
    popular: true,
  },
  {
    id: "2",
    category: "Residential Evacuation",
    title: "Residential Emergency Exit Map & Family Safety Layout",
    description: "Tailored evacuation diagrams for multi-story apartments, residential complexes, and villas.",
    rating: 4.9,
    reviewsCount: 98,
    imageSrc: "/service-2.jpg",
    providerName: "Safety Architecture",
    providerBadge: "Certified Engineers",
    avatarText: "SA",
    price: "$45",
    deliveryTime: "Delivery in 1 Day",
  },
  {
    id: "3",
    category: "3D & Isometric Maps",
    title: "High-Detail 3D Isometric Fire Evacuation Floor Plan",
    description: "Modern 3D spatial renders for easy visual understanding of complex buildings, schools, and hospitals.",
    rating: 5.0,
    reviewsCount: 215,
    imageSrc: "/service-3.jpg",
    providerName: "CAD Design Studio",
    providerBadge: "Top Rated Seller",
    avatarText: "CAD",
    price: "$95",
    deliveryTime: "Delivery in 2 Days",
    popular: true,
  },
  {
    id: "4",
    category: "Industrial & Factory Safety",
    title: "Industrial Plant Hazard & Chemical Evacuation Layout",
    description: "Specialized hazard mapping, emergency protocols, and assembly point layouts for manufacturing units.",
    rating: 4.9,
    reviewsCount: 76,
    imageSrc: "/service-4.jpg",
    providerName: "Industrial Pro",
    providerBadge: "Safety Specialists",
    avatarText: "IP",
    price: "$130",
    deliveryTime: "Delivery in 3 Days",
  },
  {
    id: "5",
    category: "Emergency Action Plans",
    title: "Complete Emergency Action Plan (EAP) & Safety Documentation",
    description: "Comprehensive PDF manual including evacuation procedures, warden roles, and emergency contacts.",
    rating: 4.8,
    reviewsCount: 54,
    imageSrc: "/service-5.jpg",
    providerName: "Compliance Guard",
    providerBadge: "OSHA Certified",
    avatarText: "CG",
    price: "$80",
    deliveryTime: "Delivery in 2 Days",
  },
  {
    id: "6",
    category: "Fire Safety Audit & Compliance",
    title: "Building Fire Safety Audit & Standard Compliance Check",
    description: "In-depth technical audit report checking fire alarms, extinguishers, and structural exit compliance.",
    rating: 5.0,
    reviewsCount: 110,
    imageSrc: "/service-6.jpg",
    providerName: "Fire Safety Expert",
    providerBadge: "Code Compliant Designs",
    avatarText: "EPS",
    price: "$150",
    deliveryTime: "Delivery in 3–5 Days",
    popular: true,
  },
  {
    id: "7",
    category: "Site Plan & Exit Diagrams",
    title: "Outdoor Site Evacuation Diagram & Assembly Point Map",
    description: "Large-scale master site maps highlighting external emergency exit routes, hydrants, and muster points.",
    rating: 4.9,
    reviewsCount: 62,
    imageSrc: "/service-7.jpg",
    providerName: "GeoSafety Draft",
    providerBadge: "Expert Drafter",
    avatarText: "GD",
    price: "$70",
    deliveryTime: "Delivery in 2 Days",
  },
  {
    id: "8",
    category: "Commercial Evacuation",
    title: "Hotel & Restaurant Emergency Exit Door Diagrams",
    description: "Individual room-door evacuation stickers and hallway directional egress maps for hospitality.",
    rating: 5.0,
    reviewsCount: 89,
    imageSrc: "/service-8.jpg",
    providerName: "Safety Architecture",
    providerBadge: "Certified Engineers",
    avatarText: "SA",
    price: "$65",
    deliveryTime: "Delivery in 1–2 Days",
  },
];

export default function ServicePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Services based on Category and Search Query
  const filteredServices = allServices.filter((service) => {
    const matchesCategory =
      selectedCategory === "All" || service.category === selectedCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* ---------------- 1. Hero Header ---------------- */}
      <section className="bg-slate-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-full px-4 py-1.5 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" /> Code Compliant & Professional Services
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Professional <span className="text-emerald-400">Evacuation & Fire Safety</span> Services
          </h1>

          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Explore our wide range of OSHA, NFPA & ISO compliant evacuation maps, 3D floor plans, emergency action protocols, and safety audits.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search evacuation plans, 3D maps, audits..."
                className="w-full bg-slate-800 border border-slate-700 rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. Filter Tabs ---------------- */}
      <section className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-3 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ---------------- 3. Service Cards Grid ---------------- */}
      <section className="max-w-7xl mx-auto px-4 mt-10">
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 font-medium">
              No evacuation services found matching your query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-3 text-sm text-emerald-600 font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group"
              >
                {/* Image Banner */}
                <div className="relative w-full h-52 bg-slate-800 overflow-hidden">
                  {service.popular && (
                    <span className="absolute top-3 left-3 z-10 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-md">
                      Popular
                    </span>
                  )}
                  <Image
                    src={service.imageSrc}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {service.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-900">
                          {service.rating.toFixed(1)}
                        </span>
                        <span className="text-slate-400">
                          ({service.reviewsCount})
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors mb-2">
                      {service.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
                      {service.description}
                    </p>
                  </div>

                  {/* Footer Info */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    {/* Provider Info */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-center text-xs">
                        {service.avatarText}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-xs leading-tight">
                          {service.providerName}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {service.providerBadge}
                        </p>
                      </div>
                    </div>

                    {/* Price & Delivery */}
                    <div className="text-right">
                      <span className="font-black text-slate-900 text-base block leading-none">
                        {service.price}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 justify-end">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {service.deliveryTime}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------------- 4. Bottom Custom Order Banner ---------------- */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold">
              Need a Custom Evacuation Plan or Special Request?
            </h3>
            <p className="text-slate-300 text-sm max-w-xl">
              Send us your floor plan (PDF, Hand Sketch, DWG) and get a personalized quote within hours.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-emerald-500/20 whitespace-nowrap text-sm"
          >
            Request Custom Order
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}