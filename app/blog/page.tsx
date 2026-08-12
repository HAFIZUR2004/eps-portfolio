"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, List, Clock, Tag } from "lucide-react";

// Types Definition
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
}

interface Category {
  name: string;
  count: string;
}

// Dummy Blog Posts Data
const samplePosts: BlogPost[] = [
  {
    id: 1,
    title: "UK Fire Evacuation Plan Requirements",
    excerpt:
      "Every business in the UK is responsible for ensuring the safety of employees and visitors during emergencies. A properly...",
    image: "https://via.placeholder.com/400x250/006A4E/FFFFFF?text=Emergency+Evacuation+Plan",
    category: "Evacuation Plan",
    date: "07 Aug 2026",
  },
  {
    id: 2,
    title: "UK Fire Evacuation Plan Requirements",
    excerpt:
      "Every business in the UK is responsible for ensuring the safety of employees and visitors during emergencies. A properly...",
    image: "https://via.placeholder.com/400x250/006A4E/FFFFFF?text=Emergency+Evacuation+Plan",
    category: "Evacuation Plan",
    date: "07 Aug 2026",
  },
  {
    id: 3,
    title: "UK Fire Evacuation Plan Requirements",
    excerpt:
      "Every business in the UK is responsible for ensuring the safety of employees and visitors during emergencies. A properly...",
    image: "https://via.placeholder.com/400x250/006A4E/FFFFFF?text=Emergency+Evacuation+Plan",
    category: "Evacuation Plan",
    date: "07 Aug 2026",
  },
  {
    id: 4,
    title: "UK Fire Evacuation Plan Requirements",
    excerpt:
      "Every business in the UK is responsible for ensuring the safety of employees and visitors during emergencies. A properly...",
    image: "https://via.placeholder.com/400x250/006A4E/FFFFFF?text=Emergency+Evacuation+Plan",
    category: "Evacuation Plan",
    date: "07 Aug 2026",
  },
  {
    id: 5,
    title: "UK Fire Evacuation Plan Requirements",
    excerpt:
      "Every business in the UK is responsible for ensuring the safety of employees and visitors during emergencies. A properly...",
    image: "https://via.placeholder.com/400x250/006A4E/FFFFFF?text=Emergency+Evacuation+Plan",
    category: "Evacuation Plan",
    date: "07 Aug 2026",
  },
  {
    id: 6,
    title: "UK Fire Evacuation Plan Requirements",
    excerpt:
      "Every business in the UK is responsible for ensuring the safety of employees and visitors during emergencies. A properly...",
    image: "https://via.placeholder.com/400x250/006A4E/FFFFFF?text=Emergency+Evacuation+Plan",
    category: "Evacuation Plan",
    date: "07 Aug 2026",
  },
];

// Categories List Data
const categories: Category[] = [
  { name: "Evacuation Plan", count: "05" },
  { name: "Fire Safety Plan", count: "02" },
  { name: "Fire Zone Block Plan", count: "10" },
  { name: "Fire Hydrant Block Plan", count: "03" },
];

// Popular Tags Data
const popularTags: string[] = [
  "Evacuation Plan",
  "Fire Safety Plan",
  "Fire Hydrant Block Plan",
  "Exit Plan",
  "Fire Zone Block Plan",
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-800">
      {/* Top Banner Header */}
      

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Search Box */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-gray-900 font-bold text-sm">
                <Search className="w-4 h-4 text-emerald-600" />
                <span>Search</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/50"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold text-sm">
                <List className="w-4 h-4 text-emerald-600" />
                <span>Categories</span>
              </div>
              <ul className="space-y-3 text-xs font-medium text-gray-700">
                {categories.map((cat, idx) => (
                  <li key={idx} className="flex justify-between items-center hover:text-emerald-600 cursor-pointer transition-colors">
                    <span>{cat.name}</span>
                    <span className="font-semibold text-gray-500">{cat.count}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-4 text-xs font-bold text-emerald-700 hover:underline inline-block">
                More 20+ Categories
              </button>
            </div>

            {/* Recent Blogs */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold text-sm">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Recent Blogs</span>
              </div>
              <div className="space-y-3">
                {samplePosts.slice(0, 4).map((post, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all cursor-pointer"
                  >
                    <div className="w-16 h-12 relative rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                        {post.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {post.category} • {post.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold text-sm">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>Popular Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium bg-gray-100 hover:bg-emerald-100 hover:text-emerald-800 text-gray-700 px-3 py-1.5 rounded-md cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </aside>

          {/* RIGHT BLOG GRID */}
          <section className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {samplePosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Blog Image */}
                    <div className="w-full h-48 relative bg-gray-100">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    {/* Blog Content */}
                    <div className="p-5">
                      <h3 className="text-base font-bold text-gray-900 leading-snug hover:text-emerald-600 cursor-pointer transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Blog Footer (Category & Date) */}
                  <div className="px-5 pb-5 pt-2 border-t border-dashed border-gray-100 flex items-center gap-2 text-[11px] text-gray-500">
                    <div className="w-5 h-5 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-[9px] text-orange-600 font-bold shrink-0">
                      EP
                    </div>
                    <span className="font-semibold text-gray-700">{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Services / Load More Button */}
            <div className="mt-12 text-center">
              <button className="bg-black hover:bg-gray-800 text-white font-semibold text-xs py-3 px-8 rounded-lg shadow-md transition-all active:scale-95">
                View All Services
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}