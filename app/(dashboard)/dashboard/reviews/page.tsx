"use client";

import { useEffect, useState } from 'react';
import { Star, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';

interface Review {
  _id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  title: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const status = filter === 'pending' ? 'pending' : filter === 'approved' ? 'approved' : 'all';
      const res = await fetch(`/api/reviews/admin?status=${status}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch reviews');
      }
      
      const data = await res.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        console.error('API did not return an array:', data);
        setReviews([]);
        setError('Invalid data format received');
      }
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      setError(error.message || 'Failed to fetch reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this review?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: true })
      });
      
      if (res.ok) {
        await fetchReviews();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to approve review');
      }
    } catch (error) {
      alert('Failed to approve review');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject this review?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: false })
      });
      
      if (res.ok) {
        await fetchReviews();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to reject review');
      }
    } catch (error) {
      alert('Failed to reject review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review permanently?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        await fetchReviews();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete review');
      }
    } catch (error) {
      alert('Failed to delete review');
    }
  };

  // Safely filter reviews with null/undefined check
  const getFilteredReviews = () => {
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return [];
    }
    
    if (filter === 'all') {
      return reviews;
    }
    
    if (filter === 'pending') {
      return reviews.filter(r => r.isApproved === false);
    }
    
    if (filter === 'approved') {
      return reviews.filter(r => r.isApproved === true);
    }
    
    return reviews;
  };

  const filteredReviews = getFilteredReviews();
  
  // Count pending and approved reviews safely
  const pendingCount = Array.isArray(reviews) ? reviews.filter(r => !r.isApproved).length : 0;
  const approvedCount = Array.isArray(reviews) ? reviews.filter(r => r.isApproved).length : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Review Moderation</h1>
        <div className="flex gap-2 flex-wrap">
          {['pending', 'approved', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f 
                  ? 'bg-[#006A4E] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'pending' && pendingCount > 0 && ` (${pendingCount})`}
              {f === 'approved' && approvedCount > 0 && ` (${approvedCount})`}
            </button>
          ))}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          ❌ {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#006A4E] border-t-transparent"></div>
          <p className="mt-2 text-gray-500">Loading reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No reviews found</p>
          <p className="text-sm mt-1">Try changing the filter or check back later</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {review.avatar ? (
                      <img 
                        src={review.avatar} 
                        alt={review.name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {review.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{review.name}</p>
                      <p className="text-sm text-gray-500">{review.email}</p>
                      <p className="text-xs text-gray-400">{review.title}</p>
                    </div>
                    <span className={`ml-0 sm:ml-3 text-xs px-3 py-1 rounded-full font-medium ${
                      review.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {review.isApproved ? (
                        <><CheckCircle className="w-3 h-3 inline mr-1" /> Approved</>
                      ) : (
                        <><Clock className="w-3 h-3 inline mr-1" /> Pending</>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex gap-0.5 my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">"{review.comment}"</p>
                  
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()} • {new Date(review.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                
                <div className="flex gap-2 ml-0 sm:ml-4 flex-wrap">
                  {!review.isApproved ? (
                    <>
                      <button 
                        onClick={() => handleApprove(review._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button 
                        onClick={() => handleDelete(review._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleReject(review._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button 
                        onClick={() => handleDelete(review._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}