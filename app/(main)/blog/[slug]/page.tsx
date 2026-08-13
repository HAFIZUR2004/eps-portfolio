"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  List,
  Clock,
  Tag,
  User,
  Calendar,
  MessageSquare,
  Star,
  ChevronLeft,
  ChevronRight,
  CornerDownRight,
} from "lucide-react";

// Sidebar Mock Data
const categories = [
  { name: "Evacuation Plan", count: "05" },
  { name: "Fire Safety Plan", count: "02" },
  { name: "Fire Zone Block Plan", count: "10" },
  { name: "Fire Hydrant Block Plan", count: "03" },
];

const popularTags = [
  "Evacuation Plan",
  "Fire Safety Plan",
  "Fire Hydrant Block Plan",
  "Exit Plan",
  "Fire Zone Block Plan",
];

const recentBlogs = [
  {
    title: "UK Fire Evacuation Plan Requirements...",
    category: "Evacuation Plan",
    date: "07 Aug 2026",
    image: "https://via.placeholder.com/150/006A4E/FFFFFF?text=Plan",
  },
  {
    title: "UK Fire Evacuation Plan Requirements...",
    category: "Evacuation Plan",
    date: "07 Aug 2026",
    image: "https://via.placeholder.com/150/006A4E/FFFFFF?text=Plan",
  },
  {
    title: "UK Fire Evacuation Plan Requirements...",
    category: "Evacuation Plan",
    date: "07 Aug 2026",
    image: "https://via.placeholder.com/150/006A4E/FFFFFF?text=Plan",
  },
  {
    title: "UK Fire Evacuation Plan Requirements...",
    category: "Evacuation Plan",
    date: "07 Aug 2026",
    image: "https://via.placeholder.com/150/006A4E/FFFFFF?text=Plan",
  },
];

// Comment Data Interface
interface Comment {
  id: number;
  name: string;
  role?: string;
  avatar: string;
  rating?: number;
  date: string;
  text: string;
  isAuthorReply?: boolean;
}

const commentsData: Comment[] = [
  {
    id: 1,
    name: "kadajssvavmander",
    avatar: "https://via.placeholder.com/100/3B82F6/FFFFFF?text=U1",
    rating: 5.0,
    date: "2 days ago",
    text: "Thank you for this informative article! I've had a couple of hit and miss experiences with freelancers in the past, and I realize now that I wasn't vetting them properly. Your checklist for choosing the right freelancer is going to be my go-to from now on.",
  },
  {
    id: 2,
    name: "Dane Jose",
    avatar: "https://via.placeholder.com/100/10B981/FFFFFF?text=U2",
    rating: 5.0,
    date: "1 Month ago",
    text: "Overall, I highly recommend this freelancer to anyone looking for high-quality work and exceptional service. They are a true professional and I will definitely be hiring them again for future projects. Thank you for your hard work and dedication!",
  },
  {
    id: 3,
    name: "Harry",
    role: "Author",
    avatar: "https://via.placeholder.com/100/F59E0B/FFFFFF?text=H",
    date: "1 Month ago",
    text: "Thank you for your comment and I will try to make another post on that topic.",
    isAuthorReply: true,
  },
];

export default function BlogDetailsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-800">
      {/* Top Banner Header */}
      <header className="bg-[#FAF0E6] py-8 text-center border-b border-orange-100">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-wide">
          Blog Details
        </h1>
      </header>

      {/* Main Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Search Box */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-gray-900 font-bold text-sm">
                <Search className="w-4 h-4 text-emerald-600" />
                <span>Search</span>
              </div>
              <input
                type="text"
                placeholder="Enter Keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/50"
              />
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
                {recentBlogs.map((post, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all cursor-pointer"
                  >
                    <div className="w-16 h-12 relative rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
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


          {/* ================= RIGHT BLOG CONTENT ================= */}
          <section className="lg:col-span-8 space-y-8">
            
            {/* Article Main Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-8 shadow-sm">
              
              {/* Featured Cover Image */}
              <div className="w-full h-64 md:h-96 relative rounded-xl overflow-hidden mb-6 bg-gray-100">
                <Image
                  src="https://via.placeholder.com/1000x600/2D3748/FFFFFF?text=Blog+Featured+Image"
                  alt="Blog Cover"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Author & Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-gray-800">Robert Hollenbeck</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Jan 20, 2025</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                    <span>10 comments</span>
                  </div>
                </div>

                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[11px] font-semibold">
                  Freelancing
                </span>
              </div>

              {/* Article Content */}
              <div className="space-y-4 text-xs md:text-sm text-gray-600 leading-relaxed">
                <p>
                  In today&apos;s fast-paced business world, leveraging the skills of freelancers has become an essential strategy for project success. With the rise of the gig economy, you now have access to a global pool of talented individuals ready to contribute to your endeavors. However, the key to harnessing this potential lies in selecting the right freelancer. This guide walks you through the steps to ensure you make the best choice for your project needs.
                </p>
                <p>
                  Before diving into the sea of freelancers, it&apos;s crucial to have a clear understanding of what your project entails. Defining the scope of work involves outlining specific tasks, deliverables, and deadlines. A well-articulated project description not only helps you understand your own needs but also allows freelancers to accurately assess if they can fulfill your requirements.
                </p>

                {/* Highlight Quote Box */}
                <blockquote className="my-6 p-4 rounded-xl bg-orange-50/50 border-l-4 border-orange-300 text-gray-700 text-xs italic leading-relaxed">
                  Once you&apos;ve chosen a freelancer, ensure that there is a clear contract in place. This should outline project scope, payment terms, deadlines, and any other important details. A well-defined contract protects both you and the freelancer and sets clear expectations.
                </blockquote>

                <p>
                  If you&apos;ve requested proposals, compare them not just on price, but also on the value each freelancer brings to the table. Look at their proposed timelines, strategies, and any additional details.
                </p>
                <p>
                  Choosing the right freelancer for your project requires a thoughtful approach. By clearly defining your project, carefully searching and evaluating candidates, and ensuring a solid contractual agreement, you can establish a successful and productive working relationship. Remember, the right freelancer can not only help complete your project but also add immense value through their specialized skills and perspectives.
                </p>
              </div>

              {/* Article Tags */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
                {["Hiring Tips", "Freelancer Selection", "Project Management"].map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium px-3 py-1.5 rounded-md cursor-pointer transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>

            </div>


            {/* Author Profile Card */}
            <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-orange-100/60 flex items-center gap-5">
              <div className="w-16 h-16 relative rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                <Image
                  src="https://via.placeholder.com/150/D97706/FFFFFF?text=Author"
                  alt="Robert Hollenbeck"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  Author: <span className="text-gray-800">Robert Hollenbeck</span>
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  I am an experienced project manager and consultant with a rich background in digital project execution and freelance talent acquisition.
                </p>
              </div>
            </div>


            {/* Post Navigation Links */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 text-xs font-semibold text-gray-600 border-y border-gray-200/80">
              <a href="#" className="flex items-center gap-2 hover:text-emerald-700 transition-colors">
                <ChevronLeft className="w-4 h-4" />
                <div className="text-left">
                  <span className="text-[10px] text-gray-400 block font-normal">Previous Post</span>
                  <span>The Future of Remote Work: Trends and Predictions</span>
                </div>
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-emerald-700 transition-colors text-right">
                <div>
                  <span className="text-[10px] text-gray-400 block font-normal">Next Post</span>
                  <span>Top 10 In-Demand Skills in the Gig Economy for 2026</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>


            {/* Comments Section */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">
                  Comments (10)
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Sort By</span>
                  <select className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none font-medium">
                    <option>Recommended</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {commentsData.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-4 rounded-xl border ${
                      comment.isAuthorReply
                        ? "bg-gray-50/80 border-gray-100 ml-6 md:ml-10"
                        : "bg-white border-gray-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 relative rounded-full overflow-hidden shrink-0 bg-gray-200">
                        <Image
                          src={comment.avatar}
                          alt={comment.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-gray-900">
                              {comment.name}
                            </h4>
                            {comment.role && (
                              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded">
                                {comment.role}
                              </span>
                            )}
                          </div>
                          
                          {/* Rating & Date */}
                          <div className="flex items-center gap-2 text-[10px] text-gray-400">
                            {comment.rating && (
                              <div className="flex items-center text-amber-500 font-bold gap-1">
                                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                                <span>{comment.rating.toFixed(1)}</span>
                              </div>
                            )}
                            <span>{comment.date}</span>
                          </div>
                        </div>

                        {/* Comment Text */}
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                          {comment.text}
                        </p>

                        {/* Reply Button */}
                        <button className="mt-3 flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-emerald-600 transition-colors">
                          <CornerDownRight className="w-3 h-3" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>

        </div>
      </main>
    </div>
  );
}