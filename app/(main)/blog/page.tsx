"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, List, Clock, Plus, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // Category Modal & Form State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [modalMessage, setModalMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch Data Function
  const fetchData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search: searchQuery,
        category: selectedCategory,
      });
      const res = await fetch(`/api/blogs?${query.toString()}`);
      const data = await res.json();

      setPosts(data.posts || []);
      setCategories(data.categories || []);
      setRecentPosts(data.recentPosts || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Fetch Effect
  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  // Handle Add Category Submission
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setCreatingCategory(true);
    setModalMessage(null);

    try {
      // Slug Generation
      const slug = newCategoryName
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName, slug }),
      });

      const data = await res.json();

      if (res.ok) {
        setModalMessage({ type: "success", text: "Category added successfully!" });
        setNewCategoryName("");
        // Refresh categories
        fetchData();
        setTimeout(() => {
          setIsCategoryModalOpen(false);
          setModalMessage(null);
        }, 1200);
      } else {
        setModalMessage({ type: "error", text: data.error || "Failed to add category." });
      }
    } catch (err: any) {
      setModalMessage({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setCreatingCategory(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-gray-800">
      
      {/* Top Header */}
      <div className="mb-8 flex items-center justify-center gap-4 pt-10">
        <div className="relative h-8 w-8 shrink-0">
          <span className="absolute left-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
          <span className="absolute right-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
        </div>
        <h2 className="whitespace-nowrap text-3xl font-bold tracking-tight text-black md:text-4xl">
          Blog
        </h2>
        <div className="relative h-8 w-8 shrink-0">
          <span className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
          <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="lg:col-span-4 space-y-6">

            {/* Search Box */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-gray-900 font-bold text-sm">
                <Search className="w-4 h-4 text-slate-700" />
                <span>Search</span>
              </div>
              <div className="border-b border-gray-100 mb-4" />
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter Keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Dynamic Categories */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                  <List className="w-4 h-4 text-slate-700" />
                  <span>Categories</span>
                </div>
                {/* Add Category Button */}
                
              </div>

              <div className="border-b border-gray-100 mb-4" />

              <ul className="space-y-3.5 text-xs font-semibold text-gray-700">
                <li
                  onClick={() => setSelectedCategory("")}
                  className={`cursor-pointer transition-colors ${
                    selectedCategory === "" ? "text-emerald-700 font-bold" : "hover:text-emerald-600"
                  }`}
                >
                  All Categories
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`flex justify-between items-center cursor-pointer transition-colors ${
                      selectedCategory === cat.slug ? "text-emerald-700 font-bold" : "hover:text-emerald-600"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="font-bold text-gray-800">
                      {String(cat.count || 0).padStart(2, "0")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Blogs */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-gray-900 font-bold text-sm">
                <Clock className="w-4 h-4 text-slate-700" />
                <span>Recent Blogs</span>
              </div>
              <div className="border-b border-gray-100 mb-4" />
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all group bg-white"
                  >
                    <div className="w-16 h-14 relative rounded-lg overflow-hidden shrink-0 bg-gray-100 p-1">
                      <Image
                        src={post.image || "https://via.placeholder.com/150"}
                        alt={post.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-[10px] font-medium text-gray-400 mt-1">
                        {post.category?.name || "General"}
                      </p>
                      <p className="text-[10px] font-medium text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </aside>

          {/* ================= RIGHT BLOG MAIN GRID ================= */}
          <section className="lg:col-span-8">
            {loading ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 font-medium">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-sm text-gray-500 font-medium">No blog posts found.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                  }}
                  className="mt-3 text-xs text-emerald-600 font-bold hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-2xl border border-gray-200/80 p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="w-full h-52 relative bg-gray-100/80 rounded-xl overflow-hidden p-2">
                        <div className="w-full h-full relative rounded-lg overflow-hidden">
                          <Image
                            src={post.image || "https://via.placeholder.com/300"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="px-1 pt-4 pb-2">
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-2 leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Card Footer */}
                    <div className="px-1 pt-3 pb-1 border-t border-dashed border-gray-200 mt-2 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0 flex items-center justify-center overflow-hidden border border-gray-300/50">
                        <span className="text-[9px] font-bold text-gray-600">
                          {post.category?.name ? post.category.name.substring(0, 2).toUpperCase() : "BLOG"}
                        </span>
                      </div>
                      <div className="flex flex-col text-[10px] font-semibold text-gray-600">
                        <span>{post.category?.name || "General"}</span>
                        <span className="text-gray-400 font-medium">
                          {new Date(post.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* ================= ADD CATEGORY MODAL ================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-gray-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Add New Category</h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification */}
            {modalMessage && (
              <div
                className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-medium border ${
                  modalMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                {modalMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{modalMessage.text}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAddCategory} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fire Safety Plan"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-gray-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCategory}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {creatingCategory ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Add Category</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}