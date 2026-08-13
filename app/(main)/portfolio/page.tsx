"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, Check } from "lucide-react";

interface PortfolioItem {
  id: number;
  title: string;
  image: string;
  category: string;
  orientation: "portrait" | "landscape";
}

const categories = [
  { name: "All Categories", count: null },
  { name: "Fire Evacuation Plan", count: 10 },
  { name: "Fire Alarm Zone Plan", count: 8 },
  { name: "Fire Zone Block Plan", count: 5 },
  { name: "Fire Hydrant Block Plan", count: 3 },
  { name: "Floor Plan Redesign", count: 20 },
  { name: "Others", count: 5 },
];

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Emergency Evacuation Plan 1",
    image: "https://via.placeholder.com/400x600/006A4E/FFFFFF?text=Evacuation+Plan+1",
    category: "Fire Evacuation Plan",
    orientation: "portrait",
  },
  {
    id: 2,
    title: "Emergency Evacuation Plan 2",
    image: "https://via.placeholder.com/400x600/006A4E/FFFFFF?text=Evacuation+Plan+2",
    category: "Fire Evacuation Plan",
    orientation: "portrait",
  },
  {
    id: 3,
    title: "Emergency Evacuation Plan 3",
    image: "https://via.placeholder.com/400x600/006A4E/FFFFFF?text=Evacuation+Plan+3",
    category: "Fire Evacuation Plan",
    orientation: "portrait",
  },
  {
    id: 4,
    title: "Emergency Evacuation Plan 4",
    image: "https://via.placeholder.com/400x600/006A4E/FFFFFF?text=Evacuation+Plan+4",
    category: "Fire Evacuation Plan",
    orientation: "portrait",
  },
  {
    id: 5,
    title: "Emergency Evacuation Plan Horizontal 1",
    image: "https://via.placeholder.com/600x400/006A4E/FFFFFF?text=Evacuation+Plan+Landscape",
    category: "Floor Plan Redesign",
    orientation: "landscape",
  },
  {
    id: 6,
    title: "Emergency Evacuation Plan 5",
    image: "https://via.placeholder.com/400x600/006A4E/FFFFFF?text=Evacuation+Plan+5",
    category: "Fire Evacuation Plan",
    orientation: "portrait",
  },
  {
    id: 7,
    title: "Emergency Evacuation Plan Horizontal 2",
    image: "https://via.placeholder.com/600x400/006A4E/FFFFFF?text=Evacuation+Plan+Landscape+2",
    category: "Fire Zone Block Plan",
    orientation: "landscape",
  },
  {
    id: 8,
    title: "Emergency Evacuation Plan Horizontal 3",
    image: "https://via.placeholder.com/600x400/006A4E/FFFFFF?text=Evacuation+Plan+Landscape+3",
    category: "Fire Alarm Zone Plan",
    orientation: "landscape",
  },
  {
    id: 9,
    title: "Emergency Evacuation Plan 6",
    image: "https://via.placeholder.com/400x600/006A4E/FFFFFF?text=Evacuation+Plan+6",
    category: "Fire Evacuation Plan",
    orientation: "portrait",
  },
  {
    id: 10,
    title: "Emergency Evacuation Plan 7",
    image: "https://via.placeholder.com/400x600/006A4E/FFFFFF?text=Evacuation+Plan+7",
    category: "Fire Evacuation Plan",
    orientation: "portrait",
  },
  {
    id: 11,
    title: "Emergency Evacuation Plan Horizontal 4",
    image: "https://via.placeholder.com/600x400/006A4E/FFFFFF?text=Evacuation+Plan+Landscape+4",
    category: "Floor Plan Redesign",
    orientation: "landscape",
  },
];

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  // Filter Logic
  const filteredItems =
    selectedCategory === "All Categories"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-800">
      {/* Top Banner Header */}
      

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Filters Top Bar */}
        <div className="relative z-20 mb-8 flex flex-wrap gap-3 items-center">
          
          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:border-gray-400 transition-colors"
            >
              <span>Category</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {isCategoryOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-30 space-y-1">
                {categories.map((cat, idx) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setIsCategoryOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                        isSelected
                          ? "bg-gray-50 text-gray-900 font-bold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-gray-900" />
                        ) : (
                          <span className="w-3.5" />
                        )}
                        <span>{cat.name}</span>
                      </div>
                      {cat.count !== null && (
                        <span className="text-gray-400 text-[11px] font-normal">
                          ({cat.count})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Country Filter Dropdown */}
          <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:border-gray-400 transition-colors">
            <span>Country</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {/* Language Filter Dropdown */}
          <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:border-gray-400 transition-colors">
            <span>Language</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>

        {/* Portfolio Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-start">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div
                className={`relative w-full bg-gray-100 ${
                  item.orientation === "landscape" ? "h-64 sm:h-72" : "h-96 sm:h-[480px]"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}