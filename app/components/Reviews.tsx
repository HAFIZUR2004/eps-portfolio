"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

// Static fallback reviews
const staticReviews = [
  {
    id: 1,
    name: "SL",
    country: "United Kingdom",
    initialBg: "bg-amber-600",
    rating: 5,
    createdAt: new Date().toISOString(),
    comment: "Fantastic customer service from Will, who's very patient and helpful.",
  },
  {
    id: 2,
    name: "Charles Luciano",
    country: "Saudi Arabia",
    initialBg: "bg-sky-600",
    rating: 5,
    createdAt: new Date().toISOString(),
    comment: "Just had Dustin from this company conduct a safety inspection. Very impressed with the service.",
  },
  {
    id: 3,
    name: "Kanokphan Sirithepvattana",
    country: "Philippines",
    initialBg: "bg-emerald-600",
    rating: 5,
    createdAt: new Date().toISOString(),
    comment: "Will serviced our fire equipment in our massage parlour. Very friendly and happy to explain any questions we had.",
  },
  {
    id: 4,
    name: "John Doe",
    country: "United States",
    initialBg: "bg-purple-600",
    rating: 5,
    createdAt: new Date().toISOString(),
    comment: "Exceptional service and quick delivery of plans. Highly recommended!",
  },
];

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState(staticReviews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reviews?status=approved');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setReviews(data);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, reviews.length - 3) : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= reviews.length - 3 ? 0 : prev + 1));
  };

  const handleSubmitReview = async (formData: { rating: number; comment: string; title: string }) => {
    // Double check user is signed in
    if (!isLoaded || !isSignedIn || !user) {
      alert('Please sign in to submit a review');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get user details from Clerk
      const userData = {
        userId: user.id,
        name: user.fullName || user.username || 'Anonymous',
        email: user.emailAddresses?.[0]?.emailAddress || 'no-email@provided.com',
        avatar: user.imageUrl || '',
      };

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          title: formData.title,
          rating: formData.rating,
          comment: formData.comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      alert('✅ Thank you! Your review has been submitted and is pending approval.');
      setShowReviewForm(false);
      // Refresh approved reviews
      await fetchReviews();
      
    } catch (error: any) {
      console.error('Error submitting review:', error);
      setError(error.message);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#FAF7F2] py-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto rounded-3xl my-8">
      {/* Title Header */}
      <div className="mb-10 flex items-center justify-center gap-4">
        <div className="relative h-8 w-8 shrink-0">
          <span className="absolute left-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
          <span className="absolute right-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
        </div>
        <h2 className="whitespace-nowrap text-3xl font-bold tracking-tight text-black md:text-4xl">
          Trusted by Clients Worldwide
        </h2>
        <div className="relative h-8 w-8 shrink-0">
          <span className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
          <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="max-w-md mx-auto mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Write Review Button - Only for signed in users */}
      {isLoaded && isSignedIn && (
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-[#006A4E] text-white px-6 py-2 rounded-full hover:bg-[#005a42] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {showReviewForm ? '✕ Cancel' : '✏️ Write a Review'}
          </button>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && isSignedIn && user && (
        <ReviewForm 
          onSubmit={handleSubmitReview} 
          isSubmitting={isSubmitting}
          user={{
            name: user.fullName || user.username || 'User',
            avatar: user.imageUrl || '',
          }}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-3 text-center lg:text-left flex flex-col items-center lg:items-start justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-extrabold tracking-wider text-gray-900 uppercase">EXCELLENT</h3>
          <div className="flex items-center gap-1 my-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-emerald-500 p-1 rounded">
                <Star className="w-3.5 h-3.5 fill-white text-white" />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 font-medium">Based on {reviews.length} reviews</p>
          <div className="mt-3 text-2xl font-bold tracking-tight flex items-center gap-0.5 select-none">
            <span className="text-blue-500">G</span>
            <span className="text-red-500">o</span>
            <span className="text-amber-500">o</span>
            <span className="text-blue-500">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">e</span>
          </div>
        </div>

        <div className="lg:col-span-9 relative">
          <button 
            onClick={handlePrev}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white text-gray-700 rounded-full shadow-md items-center justify-center border border-gray-100 hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
            {reviews.slice(currentIndex, currentIndex + 3).map((rev: any) => (
              <div key={rev.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between text-left h-full transition-all duration-300 hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {rev.avatar ? (
                        <div className="w-9 h-9 rounded-full relative overflow-hidden border border-gray-100 shrink-0">
                          <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className={`w-9 h-9 rounded-full ${rev.initialBg || 'bg-emerald-600'} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}>
                          {rev.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 leading-tight line-clamp-1">{rev.name}</h4>
                        <span className="text-[10px] text-gray-400 block">{rev.country}</span>
                      </div>
                    </div>
                    <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-black flex items-center justify-center shrink-0 border border-blue-100">G</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {rev.time || new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                    "{rev.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white text-gray-700 rounded-full shadow-md items-center justify-center border border-gray-100 hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ReviewForm Component
function ReviewForm({ onSubmit, isSubmitting, user, onCancel }: any) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [title, setTitle] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter your title/country.');
      return;
    }
    if (!comment.trim()) {
      alert('Please write your review comment.');
      return;
    }
    if (comment.trim().length < 10) {
      alert('Please write at least 10 characters.');
      return;
    }
    
    onSubmit({ rating, comment, title });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">Write Your Review</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition">✕</button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          {user?.avatar ? (
            <Image src={user.avatar} alt={user.name} width={32} height={32} className="rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#006A4E] text-white flex items-center justify-center font-bold text-xs">
              {user?.name?.slice(0, 2).toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Title / Country</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition"
            placeholder="e.g., CEO at Tech / United Kingdom"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="text-2xl transition-transform hover:scale-110 focus:outline-none"
              >
                <Star className={`w-8 h-8 ${star <= (hoveredStar || rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {rating === 1 && '⭐ Poor'}
            {rating === 2 && '⭐⭐ Fair'}
            {rating === 3 && '⭐⭐⭐ Good'}
            {rating === 4 && '⭐⭐⭐⭐ Very Good'}
            {rating === 5 && '⭐⭐⭐⭐⭐ Excellent!'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition"
            placeholder="Share your experience with our service..."
          />
          <p className="text-xs text-gray-400 mt-1">{comment.length}/500 characters</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#006A4E] text-white py-2.5 rounded-full hover:bg-[#005a42] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
        >
          {isSubmitting ? '⏳ Submitting...' : '✉️ Submit Review'}
        </button>
      </form>
    </div>
  );
}