"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
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
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";

// Comment ইন্টারফেস
interface Comment {
  _id?: string;
  userId: string;
  name: string;
  email?: string;
  comment: string;
  rating?: number;
  date: string;
  isAuthorReply?: boolean;
  avatar?: string;
}

// Blog Post ইন্টারফেস
interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  author?: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  comments: Comment[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Category ইন্টারফেস
interface Category {
  _id: string;
  name: string;
  slug: string;
  count: number;
}

// Recent Post ইন্টারফেস
interface RecentPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: {
    name: string;
  };
  createdAt: string;
}

// সেফ ডেট ফরম্যাট ফাংশন
function formatCommentDate(dateString?: string) {
  if (!dateString) return "Just now";
  try {
    const date = new Date(dateString);
    // চেক করুন ডেটা ভ্যালিড কিনা
    if (isNaN(date.getTime())) return "Just now";
    return formatDistanceToNow(date, { addSuffix: true, locale: bn });
  } catch {
    return "Just now";
  }
}

export default function BlogDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user, isLoaded, isSignedIn } = useUser();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch single blog post
        const postRes = await fetch(`/api/blogs/${slug}`);
        if (!postRes.ok) {
          throw new Error("Blog post not found");
        }
        const postData = await postRes.json();
        setPost(postData);

        // Fetch categories and recent posts
        const blogsRes = await fetch("/api/blogs");
        const blogsData = await blogsRes.json();
        setCategories(blogsData.categories || []);
        setRecentPosts(blogsData.recentPosts || []);

      } catch (err: any) {
        setError(err.message || "Failed to load blog details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Handle comment submission
const handleCommentSubmit = async () => {
  if (!comment.trim()) {
    return;
  }

  try {
    setSubmitting(true);

    const res = await fetch(`/api/blogs/${slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: comment.trim(),
        rating: rating,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to submit comment");
    }

    // Update blog post with new comment
    setPost(data);

    // Clear form
    setComment("");
    setRating(5);

    console.log("Comment submitted successfully");
  } catch (error) {
    console.error("Comment submit error:", error);
  } finally {
    setSubmitting(false);
  }
};

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error || "Post not found"}</p>
          <Link href="/blog" className="mt-4 inline-block text-emerald-600 hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

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
                {categories.map((cat) => (
                  <li key={cat._id} className="flex justify-between items-center hover:text-emerald-600 cursor-pointer transition-colors">
                    <Link href={`/blog?category=${cat.slug}`}>{cat.name}</Link>
                    <span className="font-semibold text-gray-500">{String(cat.count || 0).padStart(2, "0")}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Blogs */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold text-sm">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Recent Blogs</span>
              </div>
              <div className="space-y-3">
                {recentPosts.map((recent) => (
                  <Link
                    key={recent._id}
                    href={`/blog/${recent.slug}`}
                    className="flex items-center gap-3 p-2 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all cursor-pointer"
                  >
                    <div className="w-16 h-12 relative rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image
                        src={recent.image || "https://via.placeholder.com/150"}
                        alt={recent.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                        {recent.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {recent.category?.name || "General"} •{" "}
                        {new Date(recent.createdAt).toLocaleDateString("en-GB", {
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

            {/* Popular Tags */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold text-sm">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>Popular Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag, idx) => (
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
                  src={post.image || "https://via.placeholder.com/800x400"}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Author & Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-gray-800">
                      {post.author?.name || "Admin"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                    <span>{post.comments?.length || 0} comments</span>
                  </div>
                </div>

                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[11px] font-semibold">
                  {post.category?.name || "General"}
                </span>
              </div>

              {/* Article Content */}
              <div 
                className="space-y-4 text-xs md:text-sm text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Article Tags */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
                {post.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium px-3 py-1.5 rounded-md cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

            </div>


            {/* Author Profile Card */}
            {post.author && (
              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-orange-100/60 flex items-center gap-5">
                <div className="w-16 h-16 relative rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                  <Image
                    src={post.author.avatar || "https://via.placeholder.com/100"}
                    alt={post.author.name || "Author"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    Author: <span className="text-gray-800">{post.author.name || "Admin"}</span>
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {post.author.bio || "Author bio not available."}
                  </p>
                </div>
              </div>
            )}


            {/* Post Navigation Links */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 text-xs font-semibold text-gray-600 border-y border-gray-200/80">
              <Link href="/blog" className="flex items-center gap-2 hover:text-emerald-700 transition-colors">
                <ChevronLeft className="w-4 h-4" />
                <div className="text-left">
                  <span className="text-[10px] text-gray-400 block font-normal">Back to Blog</span>
                  <span>View All Articles</span>
                </div>
              </Link>
            </div>


            {/* Comments Section */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">
                  Comments ({post.comments?.length || 0})
                </h3>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {post.comments?.map((comment: Comment, idx: number) => (
                  <div
                    key={comment._id || idx}
                    className={`p-4 rounded-xl border ${
                      comment.isAuthorReply
                        ? "bg-gray-50/80 border-gray-100 ml-6 md:ml-10"
                        : "bg-white border-gray-100"
                    }`}
                  >
                   <div className="relative w-10 h-10 overflow-hidden rounded-full">
  <Image
    src={
      comment.avatar &&
      !comment.avatar.includes("via.placeholder.com")
        ? comment.avatar
        : "/images/default-avatar.png"
    }
    alt={comment.name || "User"}
    fill
    sizes="40px"
    className="object-cover"
  />
</div>









                  </div>




                ))}
              </div>

              {/* Comment Form */}
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h4 className="text-sm font-bold text-gray-900 mb-4">Leave a Comment</h4>
                
                {isSignedIn ? (
                  <form onSubmit={handleCommentSubmit} className="space-y-3">
                    {/* User Info Display */}
                    <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 relative rounded-full overflow-hidden shrink-0">
                        <Image
                          src={user.imageUrl || "https://via.placeholder.com/100"}
                          alt={user.fullName || "User"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">
                          {user.fullName || user.firstName || "User"}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {user.primaryEmailAddress?.emailAddress || ""}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setCommentRating(star)}
                            className="text-amber-400 transition-transform hover:scale-110"
                          >
                            <Star className={`w-5 h-5 ${star <= commentRating ? "fill-amber-400" : "fill-gray-200"}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Comment *</label>
                      <textarea
                        required
                        rows={4}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write your comment here..."
                        className="w-full px-3.5 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
                      {submitting ? "Posting..." : "Post Comment"}
                    </button>
                  </form>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                    <p className="text-xs text-gray-600">
                      Please <Link href="/sign-in" className="text-emerald-600 font-bold hover:underline">Sign In</Link> to leave a comment
                    </p>
                  </div>
                )}
              </div>
            </div>

          </section>

        </div>
      </main>
    </div>
  );
}