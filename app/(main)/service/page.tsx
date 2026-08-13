"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Search, Clock, ArrowRight } from "lucide-react";

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
  price: string;
  deliveryTime: string;
  popular?: boolean;
}

// --- Categories ---
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

// --- Services Data ---
const allServices: Service[] = [
  {
    id: "1",
    category: "Commercial Evacuation",
    title: "Fire Evacuation Plan for Commercial Buildings",
    description: "OSHA & NFPA compliant emergency exit maps for offices, malls, and corporate towers.",
    rating: 5.0,
    reviewsCount: 142,
    imageSrc: "/service-1.jpg",
    providerName: "Fire Safety Expert",
    price: "$50",
    deliveryTime: "1-2 Days",
    popular: true,
  },
  {
    id: "2",
    category: "Residential Evacuation",
    title: "Residential Emergency Exit Map",
    description: "Tailored evacuation diagrams for apartments, complexes, and villas.",
    rating: 4.9,
    reviewsCount: 98,
    imageSrc: "/service-2.jpg",
    providerName: "Safety Architecture",
    price: "$45",
    deliveryTime: "1 Day",
  },
  {
    id: "3",
    category: "3D & Isometric Maps",
    title: "3D Isometric Fire Evacuation Floor Plan",
    description: "Modern 3D spatial renders for easy visual understanding of complex buildings.",
    rating: 5.0,
    reviewsCount: 215,
    imageSrc: "/service-3.jpg",
    providerName: "CAD Design Studio",
    price: "$95",
    deliveryTime: "2 Days",
    popular: true,
  },
  {
    id: "4",
    category: "Industrial Safety",
    title: "Industrial Plant Hazard Evacuation Layout",
    description: "Specialized hazard mapping and emergency protocols for manufacturing units.",
    rating: 4.9,
    reviewsCount: 76,
    imageSrc: "/service-4.jpg",
    providerName: "Industrial Pro",
    price: "$130",
    deliveryTime: "3 Days",
  },
  {
    id: "5",
    category: "Emergency Plans",
    title: "Complete Emergency Action Plan (EAP)",
    description: "Comprehensive PDF manual with evacuation procedures and emergency contacts.",
    rating: 4.8,
    reviewsCount: 54,
    imageSrc: "/service-5.jpg",
    providerName: "Compliance Guard",
    price: "$80",
    deliveryTime: "2 Days",
  },
  {
    id: "6",
    category: "Fire Audit",
    title: "Building Fire Safety Audit & Compliance Check",
    description: "Technical audit report checking fire alarms, extinguishers, and exit compliance.",
    rating: 5.0,
    reviewsCount: 110,
    imageSrc: "/service-6.jpg",
    providerName: "Fire Safety Expert",
    price: "$150",
    deliveryTime: "3-5 Days",
    popular: true,
  },
  {
    id: "7",
    category: "Site Diagrams",
    title: "Outdoor Site Evacuation Diagram",
    description: "Large-scale master site maps highlighting emergency exit routes and muster points.",
    rating: 4.9,
    reviewsCount: 62,
    imageSrc: "/service-7.jpg",
    providerName: "GeoSafety Draft",
    price: "$70",
    deliveryTime: "2 Days",
  },
  {
    id: "8",
    category: "Commercial Evacuation",
    title: "Hotel & Restaurant Emergency Exit Diagrams",
    description: "Individual room-door evacuation stickers and hallway directional maps.",
    rating: 5.0,
    reviewsCount: 89,
    imageSrc: "/service-8.jpg",
    providerName: "Safety Architecture",
    price: "$65",
    deliveryTime: "1-2 Days",
  },
];

export default function ServicePage(): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter Services
  const filteredServices: Service[] = allServices.filter((service) => {
    const matchesCategory =
      selectedCategory === "All" || service.category === selectedCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20">
      
      {/* ================= HERO SECTION ================= */}
      <section className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-5">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Professional <span className="text-emerald-400">Evacuation & Fire Safety</span> Services
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
            OSHA, NFPA & ISO compliant evacuation maps, 3D floor plans, and safety audits.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto mt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search services..."
                className="w-full bg-gray-800 border border-gray-700 rounded-full pl-12 pr-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORY TABS ================= */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ================= SERVICES GRID ================= */}
      <section className="max-w-6xl mx-auto px-4 mt-10">
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 font-medium">No services found.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service: Service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {service.popular && (
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                  <Image
                    src={service.imageSrc}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Category & Rating */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      {service.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold">{service.rating}</span>
                      <span className="text-xs text-gray-400">({service.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{service.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{service.description}</p>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <p className="font-semibold text-sm">{service.providerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{service.price}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" /> {service.deliveryTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= CUSTOM ORDER BANNER ================= */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <div className="bg-gray-900 rounded-2xl p-8 md:p-10 text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Need a Custom Evacuation Plan?</h3>
            <p className="text-gray-300 text-sm mt-1 max-w-lg">
              Send us your floor plan and get a personalized quote within hours.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Request Custom Order
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}