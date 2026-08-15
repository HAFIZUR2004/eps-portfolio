'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Loader2, Upload, Link as LinkIcon } from 'lucide-react';

interface FiverrReview {
  _id: string;
  reviewSrc: string; // 👈 এখানে reviewSrc দেওয়া হয়েছে (clientImage নয়)
}

export default function ManageFiverrReviewsPage() {
  const [reviews, setReviews] = useState<FiverrReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [reviewSrc, setReviewSrc] = useState('');
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fiverr-review');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewSrc) return alert('Please upload an image or provide a valid URL');

    try {
      setSubmitting(true);
      const res = await fetch('/api/fiverr-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewSrc }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReviewSrc('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchReviews();
      } else {
        alert(data.message || 'Failed to upload review');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Check server logs or image size.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review image?')) return;

    try {
      const res = await fetch(`/api/fiverr-review?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r._id !== id));
      } else {
        alert(data.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Manage Fiverr Reviews</h1>
        <p className="text-slate-400 text-sm mt-1">
          Upload screenshots of Fiverr reviews to showcase social proof.
        </p>
      </div>

      {/* UPLOAD FORM */}
      <form 
        onSubmit={handleAddReview} 
        className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-5"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-200">Upload New Review Screenshot</h2>
          
          {/* Toggle File / URL */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => { setUploadType('file'); setReviewSrc(''); }}
              className={`text-xs px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                uploadType === 'file' 
                  ? 'bg-slate-800 text-emerald-400 font-semibold' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Upload size={12} /> File
            </button>
            <button
              type="button"
              onClick={() => { setUploadType('url'); setReviewSrc(''); }}
              className={`text-xs px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                uploadType === 'url' 
                  ? 'bg-slate-800 text-emerald-400 font-semibold' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <LinkIcon size={12} /> URL
            </button>
          </div>
        </div>

        {uploadType === 'file' ? (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden"
              id="fiverr-review-file"
            />
            <label
              htmlFor="fiverr-review-file"
              className="w-full flex items-center justify-center gap-2 px-4 py-8 bg-slate-950 border border-dashed border-slate-800 hover:border-emerald-500/50 rounded-xl text-slate-400 cursor-pointer transition text-sm group"
            >
              <Upload className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition" />
              <span>{reviewSrc ? 'Change Image' : 'Choose Screenshot (Max 5MB)'}</span>
            </label>
          </div>
        ) : (
          <input
            type="url"
            placeholder="https://example.com/review-screenshot.png"
            value={reviewSrc}
            onChange={(e) => setReviewSrc(e.target.value)}
            required={uploadType === 'url'}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm"
          />
        )}

        {/* Preview */}
        {reviewSrc && (
          <div className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="relative w-12 h-12 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center shrink-0">
              <Image src={reviewSrc} alt="Preview" fill className="object-contain p-1" />
            </div>
            <div className="text-xs text-slate-400">
              <p className="font-semibold text-slate-300">Review Image Ready to Upload</p>
              <p className="text-slate-500 truncate max-w-xs">{reviewSrc.substring(0, 40)}...</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-xl transition flex items-center gap-2 text-sm"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Upload Review
        </button>
      </form>

      {/* REVIEW GRID */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Current Review Screenshots ({reviews.length})</h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-slate-500 text-sm py-4">No review screenshots uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {reviews.map((review) => (
              <div 
                key={review._id} 
                className="relative group border border-slate-800/80 rounded-xl p-2 flex items-center justify-center bg-slate-950 hover:border-slate-700 transition h-32"
              >
                <div className="relative w-full h-full">
                  {/* 👇 এখানে review.reviewSrc ব্যবহার করা হয়েছে */}
                  <Image
                    src={review.reviewSrc} // 👈 পুরনো clientImage এর বদলে reviewSrc
                    alt="Fiverr Review Screenshot"
                    fill
                    className="object-contain rounded-lg"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>

                <button
                  onClick={() => handleDelete(review._id)}
                  className="absolute top-2 right-2 p-1.5 bg-rose-500/10 text-rose-400 rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-rose-500/20 border border-rose-500/20"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}