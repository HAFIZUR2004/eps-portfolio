"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, Check } from "lucide-react";

interface PortfolioItem {
  _id: string;
  title: string;
  imageUrl: string;
  category: string;
  orientation: "portrait" | "landscape";
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        const res = await fetch("/api/portfolio");
        const data = await res.json();
        setItems(data.items || []);
      } catch (error) {
        console.error("Failed to load portfolio items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, []);

  const baseCategories = [
    "Fire Evacuation Plan",
    "Fire Alarm Zone Plan",
    "Fire Zone Block Plan",
    "Fire Hydrant Block Plan",
    "Floor Plan Redesign",
    "Others",
  ];

  const categories = [
    { name: "All Categories", count: items.length },
    ...baseCategories.map((cat) => ({
      name: cat,
      count: items.filter((item) => item.category === cat).length,
    })),
  ];

  const filteredItems =
    selectedCategory === "All Categories"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative z-20 mb-8 flex flex-wrap gap-3 items-center">
          <div className="relative">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:border-gray-400 transition-colors"
            >
              <span>{selectedCategory}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

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
                          ? "bg-gray-100 text-gray-900 font-bold"
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
                      <span className="text-gray-400 text-[11px] font-normal">
                        ({cat.count})
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="w-full h-80 bg-gray-200/60 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200/80">
            <p className="text-sm text-gray-500">No items found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-start">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div
                  className={`relative w-full bg-gray-100 ${
                    item.orientation === "landscape" ? "h-64 sm:h-72" : "h-96 sm:h-[480px]"
                  }`}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}