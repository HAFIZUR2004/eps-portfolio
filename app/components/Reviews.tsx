"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { countries, getFlagEmoji } from '@/lib/countries';
import toast from 'react-hot-toast'; // ✅ Imported react-hot-toast

// Static fallback reviews
const staticReviews = [
  {
    id: 1,
    name: "SL",
    position: "CEO",
    country: "United Kingdom",
    countryCode: "GB",
    initialBg: "bg-amber-600",
    rating: 5,
    createdAt: new Date().toISOString(),
    comment: "Fantastic customer service from Will, who's very patient and helpful.",
  },
  {
    id: 2,
    name: "Charles Luciano",
    position: "Safety Manager",
    country: "Saudi Arabia",
    countryCode: "SA",
    initialBg: "bg-sky-600",
    rating: 5,
    createdAt: new Date().toISOString(),
    comment: "Just had Dustin from this company conduct a safety inspection. Very impressed with the service.",
  },
  {
    id: 3,
    name: "Kanokphan Sirithepvattana",
    position: "Business Owner",
    country: "Philippines",
    countryCode: "PH",
    initialBg: "bg-emerald-600",
    rating: 5,
    createdAt: new Date().toISOString(),
    comment: "Will serviced our fire equipment in our massage parlour. Very friendly and happy to explain any questions we had.",
  },
  {
    id: 4,
    name: "John Doe",
    position: "Facility Manager",
    country: "United States",
    countryCode: "US",
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

  const handleSubmitReview = async (formData: { rating: number; comment: string; country: string; countryCode: string; position: string }) => {
    if (!isLoaded || !isSignedIn || !user) {
      toast.error('Please sign in to submit a review'); // ✅ Hot Toast
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const loadingToast = toast.loading('Submitting your review...'); // ✅ Loading state
    
    try {
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
          country: formData.country,
          countryCode: formData.countryCode,
          position: formData.position,
          rating: formData.rating,
          comment: formData.comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      toast.dismiss(loadingToast);
      toast.success('Thank you! Your review has been submitted and is pending approval.', {
        duration: 5000,
      }); // ✅ Hot Toast Success
      setShowReviewForm(false);
      await fetchReviews();
      
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.dismiss(loadingToast);
      setError(error.message);
      toast.error(error.message || 'Error submitting review'); // ✅ Hot Toast Error
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

      {/* Write Review Button */}
      {isLoaded && isSignedIn && (
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 bg-gradient-to-r from-[#006A4E] to-[#008060] rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006A4E]"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF3B1D] to-[#006A4E] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative flex items-center gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </span>
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
                          <Image src={rev.avatar} alt={rev.name} fill sizes="36px" className="object-cover" />
                        </div>
                      ) : (
                        <div className={`w-9 h-9 rounded-full ${rev.initialBg || 'bg-emerald-600'} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}>
                          {rev.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 leading-tight line-clamp-1">{rev.name}</h4>
                        <div className="flex items-center gap-1 flex-wrap">
                          {rev.position && (
                            <span className="text-[10px] text-gray-500 font-medium">{rev.position} • </span>
                          )}
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <span>{getFlagEmoji(rev.countryCode)}</span>
                            {rev.country}
                          </span>
                        </div>
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
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [position, setPosition] = useState('');
  const [searchCountry, setSearchCountry] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const countrySearchRef = useRef<HTMLDivElement>(null);

  // Filter countries safely
  const filteredCountries = (countries || []).filter(c => 
    c.name.toLowerCase().includes((searchCountry || '').toLowerCase()) ||
    c.code.toLowerCase().includes((searchCountry || '').toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countrySearchRef.current && !countrySearchRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (c: typeof countries[0]) => {
    setCountry(c.name);
    setCountryCode(c.code);
    setSearchCountry('');
    setShowCountryDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!country) {
      toast.error('Please select your country.'); // ✅ Hot Toast
      return;
    }
    if (!position.trim()) {
      toast.error('Please enter your position/designation.'); // ✅ Hot Toast
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write your review comment.'); // ✅ Hot Toast
      return;
    }
    if (comment.trim().length < 10) {
      toast.error('Please write at least 10 characters.'); // ✅ Hot Toast
      return;
    }
    
    onSubmit({ rating, comment, country, countryCode, position });
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Position / Designation *</label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition text-black"
            placeholder="e.g., CEO, Safety Manager, Business Owner"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Country *</label>
          <div className="relative" ref={countrySearchRef}>
            <div className="flex items-center gap-2">
              {countryCode && (
                <span className="text-2xl">{getFlagEmoji(countryCode)}</span>
              )}
              <input
                type="text"
                value={searchCountry || country}
                onChange={(e) => {
                  setSearchCountry(e.target.value);
                  setShowCountryDropdown(true);
                  if (e.target.value === '') {
                    setCountry('');
                    setCountryCode('');
                  }
                }}
                onFocus={() => setShowCountryDropdown(true)}
                placeholder="Search your country..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition text-black"
              />
              {country && (
                <button
                  type="button"
                  onClick={() => {
                    setCountry('');
                    setCountryCode('');
                    setSearchCountry('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {showCountryDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleCountrySelect(c)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-emerald-50 transition-colors text-left"
                    >
                      <span className="text-xl">{c.flag}</span>
                      <span className="text-gray-900">{c.name}</span>
                      <span className="text-xs text-gray-400 ml-auto">{c.code}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">No country found</div>
                )}
              </div>
            )}
          </div>
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition text-black"
            placeholder="Share your experience with our service..."
          />
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