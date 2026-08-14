"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit3, FileText, CheckCircle2, AlertCircle, Upload, Loader2, X } from "lucide-react";

export default function DashboardBlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "", // Contains Selected Category _id
    tags: "",
  });

  // Category List
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  // New Category Modal State
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Fetch Existing Blogs & Categories
  useEffect(() => {
    fetchBlogsAndCategories();
  }, []);

  const fetchBlogsAndCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(data.posts || []);
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setFormData((prev) => ({ ...prev, title, slug }));
  };

  // Cloudinary Direct Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset";

    setUploadingImage(true);
    setMessage(null);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: data,
      });

      const fileData = await res.json();

      if (fileData.secure_url) {
        setFormData((prev) => ({ ...prev, image: fileData.secure_url }));
        setMessage({ type: "success", text: "Image uploaded to Cloudinary successfully!" });
      } else {
        throw new Error(fileData.error?.message || "Failed to upload image.");
      }
    } catch (err: any) {
      console.error("Cloudinary Upload Error:", err);
      setMessage({ type: "error", text: err.message || "Image upload failed. Check Cloudinary preset settings." });
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle New Category Creation
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setMessage({ type: "error", text: "Category name cannot be empty." });
      return;
    }

    setCreatingCategory(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        // Add new category to list
        setCategories((prev) => [...prev, data.category]);
        // Auto-select the new category
        setFormData((prev) => ({ ...prev, category: data.category._id }));
        setNewCategoryName("");
        setShowNewCategoryModal(false);
        setMessage({ type: "success", text: `Category "${data.category.name}" created successfully!` });
      } else {
        const errData = await res.json();
        setMessage({ type: "error", text: errData.error || "Failed to create category." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setCreatingCategory(false);
    }
  };

  // Delete Blog Handler
  const handleDeleteBlog = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    
    setMessage(null);
    try {
      const res = await fetch(`/api/blogs/${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Blog deleted successfully!" });
        fetchBlogsAndCategories();
      } else {
        const errData = await res.json();
        setMessage({ type: "error", text: errData.error || "Failed to delete blog." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Something went wrong." });
    }
  };

  // Edit Blog - Load data into form
  const handleEditBlog = (blog: any) => {
    // Reset any previous edit state
    setEditingBlogId(blog._id);
    setEditingSlug(blog.slug);
    
    // Set form data with blog details
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image,
      category: blog.category?._id || blog.category || "",
      tags: (blog.tags || []).join(", "),
    });
    
    // Scroll to form
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    setMessage({ type: "success", text: "Blog loaded for editing. Make your changes and click Update." });
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingBlogId(null);
    setEditingSlug(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image: "",
      category: "",
      tags: "",
    });
    setMessage(null);
  };

  // Submit Handler (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      setMessage({ type: "error", text: "Please select and upload a blog thumbnail image first." });
      return;
    }

    if (!formData.category) {
      setMessage({ type: "error", text: "Please select a category." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      // Determine if we're creating or updating
      const isEditing = editingBlogId !== null;
      
      let url = "/api/blogs";
      let method = "POST";
      
      if (isEditing) {
        // Use the original slug for update
        url = `/api/blogs/${editingSlug}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage({ 
          type: "success", 
          text: isEditing ? "Blog updated successfully!" : "Blog post published successfully!" 
        });
        
        // Reset form
        setFormData({
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          image: "",
          category: "",
          tags: "",
        });
        
        setEditingBlogId(null);
        setEditingSlug(null);
        
        // Refresh list
        fetchBlogsAndCategories();
      } else {
        const errData = await res.json();
        setMessage({ 
          type: "error", 
          text: errData.error || (isEditing ? "Failed to update blog." : "Failed to publish blog.") 
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 text-slate-100">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Blog Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit and manage your website blogs and articles.
          </p>
        </div>
      </div>

      {/* Status Notification */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-medium border ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT: CREATE/EDIT BLOG FORM ================= */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md shadow-xl space-y-5">
          <div className="flex items-center justify-between gap-2 text-white font-semibold text-sm pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              {editingBlogId ? (
                <>
                  <Edit3 className="w-4 h-4 text-blue-400" />
                  <span>Edit Blog Post</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Add New Blog Post</span>
                </>
              )}
            </div>
            {editingBlogId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Blog Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Web Development Solutions"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  placeholder="modern-web-development-solutions"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>
            </div>

            {/* Dynamic Category Dropdown + Add New Category Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Select Category *
                </label>
                <div className="flex gap-2">
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  >
                    <option value="" disabled className="text-slate-500">
                      -- Select a Category --
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id} className="bg-slate-900 text-slate-100">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCategoryModal(true)}
                    className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl text-xs font-medium transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    New
                  </button>
                </div>
              </div>

              {/* Cloudinary File Picker Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Blog Image (Upload from Computer) *
                </label>
                
                {formData.image ? (
                  <div className="relative w-full h-10 rounded-xl overflow-hidden border border-emerald-500/30 bg-slate-950 flex items-center justify-between px-3">
                    <span className="text-[11px] text-emerald-400 truncate max-w-[80%] font-mono">
                      {formData.image}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 text-xs rounded-xl border border-dashed border-slate-700 bg-slate-950/50 text-slate-400 hover:text-white hover:border-slate-500 cursor-pointer transition-all">
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span>Choose File / Browse Image</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Excerpt (Short Summary) *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Brief summary of the blog post..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
              />
            </div>

            {/* Full Content */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Article Content (HTML / Plain Text) *
              </label>
              <textarea
                rows={6}
                required
                placeholder="<p>Write your detailed blog content here...</p>"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="Next.js, React, Web Design"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className={`w-full font-semibold text-xs py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 active:scale-[0.99] ${
                editingBlogId 
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/20"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/20"
              }`}
            >
              {submitting 
                ? (editingBlogId ? "Updating Blog..." : "Publishing Post...") 
                : (editingBlogId ? "Update Blog Post" : "Publish Blog Post")
              }
            </button>
          </form>
        </div>

        {/* ================= RIGHT: POSTS LIST ================= */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Existing Articles ({blogs.length})</span>
            </div>
          </div>

          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {loading ? (
              <p className="text-xs text-slate-400 text-center py-8">Loading posts...</p>
            ) : blogs.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-2xl text-center text-xs text-slate-400">
                No blogs found in database.
              </div>
            ) : (
              blogs.map((post) => (
                <div
                  key={post._id}
                  className="bg-slate-900/80 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between gap-3 hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden shrink-0 bg-slate-950 border border-slate-800">
                      <Image
                        src={post.image || "https://via.placeholder.com/150"}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-emerald-400 transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {post.category?.name || "General"} •{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => handleEditBlog(post)}
                      className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="Edit Blog"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteBlog(post.slug)}
                      className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Blog"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ================= NEW CATEGORY MODAL ================= */}
      {showNewCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm">Create New Category</h3>
              <button
                onClick={() => setShowNewCategoryModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Technology, Design, Marketing"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewCategoryModal(false)}
                  className="flex-1 py-2.5 text-xs font-medium rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={creatingCategory}
                  className="flex-1 py-2.5 text-xs font-medium rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-50"
                >
                  {creatingCategory ? "Creating..." : "Create Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}