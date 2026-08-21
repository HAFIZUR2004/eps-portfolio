'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Loader2, Upload, Pencil, ArrowUp, ArrowDown } from 'lucide-react';

interface FAQItem {
  _id: string;
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

interface FAQImage {
  _id: string;
  imageUrl: string;
  alt: string;
  position: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
  order: number;
  isActive: boolean;
}

export default function Page() {
// অথবা শুধু ডিফল্ট এক্সপোর্ট করলেই হবে
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [images, setImages] = useState<FAQImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [itemType, setItemType] = useState<'faq' | 'image'>('faq');

  // Form state for FAQ
  const [faqId, setFaqId] = useState('');
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqOrder, setFaqOrder] = useState(0);

  // Form state for Image
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imagePosition, setImagePosition] = useState<'left-top' | 'left-bottom' | 'right-top' | 'right-bottom'>('left-top');
  const [imageOrder, setImageOrder] = useState(0);
  const [uploadType, setUploadType] = useState<'file' | 'url'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/faq?type=all');
      const data = await res.json();
      if (data.success) {
        setFaqs(data.faqs || []);
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle file to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Open Modal for Add
  const openAddModal = (type: 'faq' | 'image') => {
    setItemType(type);
    setEditingItem(null);
    
    if (type === 'faq') {
      setFaqId('');
      setFaqQuestion('');
      setFaqAnswer('');
      setFaqOrder(faqs.length);
    } else {
      setImageUrl('');
      setImageAlt('');
      setImagePosition('left-top');
      setImageOrder(images.length);
      setUploadType('url');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    
    setModalOpen(true);
  };

  // Open Modal for Edit
  const openEditModal = (item: any, type: 'faq' | 'image') => {
    setItemType(type);
    setEditingItem(item);
    
    if (type === 'faq') {
      setFaqId(item.id);
      setFaqQuestion(item.question);
      setFaqAnswer(item.answer);
      setFaqOrder(item.order);
    } else {
      setImageUrl(item.imageUrl);
      setImageAlt(item.alt);
      setImagePosition(item.position);
      setImageOrder(item.order);
      setUploadType('url');
    }
    
    setModalOpen(true);
  };

  // Handle Submit (Add or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      let body: any = { type: itemType };
      
      if (itemType === 'faq') {
        if (!faqId || !faqQuestion || !faqAnswer) {
          return alert('Please fill all FAQ fields');
        }
        body.data = { id: faqId, question: faqQuestion, answer: faqAnswer, order: faqOrder };
        if (editingItem) {
          body.id = editingItem._id;
        }
      } else {
        if (!imageUrl) {
          return alert('Please upload an image');
        }
        body.data = { imageUrl: imageUrl, alt: imageAlt, position: imagePosition, order: imageOrder };
        if (editingItem) {
          body.id = editingItem._id;
        }
      }

      const url = '/api/faq';
      const method = editingItem ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setModalOpen(false);
        fetchData();
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id: string, type: 'faq' | 'image') => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      const res = await fetch(`/api/faq?type=${type}&id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Move up/down (reorder)
  const moveItem = async (id: string, type: 'faq' | 'image', direction: 'up' | 'down') => {
    const items = type === 'faq' ? faqs : images;
    const index = items.findIndex(item => item._id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === items.length - 1)) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    
    const updates = newItems.map((item, i) => ({ ...item, order: i }));
    
    try {
      for (const item of updates) {
        await fetch('/api/faq', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, id: item._id, data: { order: item.order } }),
        });
      }
      fetchData();
    } catch (error) {
      console.error('Reorder error:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Manage FAQ</h1>
          <p className="text-slate-400 text-sm mt-1">Manage FAQs and images for the FAQ section.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => openAddModal('faq')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} /> Add FAQ
          </button>
          <button
            onClick={() => openAddModal('image')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} /> Add Image
          </button>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">FAQs ({faqs.length})</h2>
        
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={faq._id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center gap-4 group hover:border-blue-500/30 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold shrink-0">
                {faq.id}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-200">{faq.question}</h4>
                <p className="text-sm text-slate-400 line-clamp-2">{faq.answer}</p>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => moveItem(faq._id, 'faq', 'up')}
                  className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-slate-200"
                  disabled={index === 0}
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => moveItem(faq._id, 'faq', 'down')}
                  className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-slate-200"
                  disabled={index === faqs.length - 1}
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={() => openEditModal(faq, 'faq')}
                  className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(faq._id, 'faq')}
                  className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 border border-rose-500/20"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Images Section */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Images ({images.length})</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, index) => (
            <div
              key={img._id}
              className="relative bg-slate-950 border border-slate-800 rounded-xl p-3 group hover:border-emerald-500/30 transition"
            >
              <div className="relative w-full h-[150px] bg-slate-900 rounded-lg overflow-hidden mb-2">
                <Image
                  src={img.imageUrl}
                  alt={img.alt || 'FAQ Image'}
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-slate-400">
                  <p>Position: {img.position}</p>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => moveItem(img._id, 'image', 'up')}
                    className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-slate-200"
                    disabled={index === 0}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => moveItem(img._id, 'image', 'down')}
                    className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-slate-200"
                    disabled={index === images.length - 1}
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => openEditModal(img, 'image')}
                    className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(img._id, 'image')}
                    className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 border border-rose-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL for Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-200 mb-4">
              {editingItem ? `Edit ${itemType === 'faq' ? 'FAQ' : 'Image'}` : `Add New ${itemType === 'faq' ? 'FAQ' : 'Image'}`}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* FAQ FORM */}
              {itemType === 'faq' && (
                <>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">ID</label>
                    <input
                      type="text"
                      value={faqId}
                      onChange={(e) => setFaqId(e.target.value)}
                      placeholder="01, 02, etc."
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Question</label>
                    <input
                      type="text"
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      placeholder="What is the process?"
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Answer</label>
                    <textarea
                      value={faqAnswer}
                      onChange={(e) => setFaqAnswer(e.target.value)}
                      placeholder="The process includes..."
                      rows={4}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 resize-none"
                      required
                    />
                  </div>
                </>
              )}

              {/* IMAGE FORM */}
              {itemType === 'image' && (
                <>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Image</label>
                    <div className="flex gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => { setUploadType('file'); setImageUrl(''); }}
                        className={`text-xs px-3 py-1 rounded ${uploadType === 'file' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500'}`}
                      >
                        File
                      </button>
                      <button
                        type="button"
                        onClick={() => { setUploadType('url'); setImageUrl(''); }}
                        className={`text-xs px-3 py-1 rounded ${uploadType === 'url' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500'}`}
                      >
                        URL
                      </button>
                    </div>

                    {uploadType === 'file' ? (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="modal-file-input"
                        />
                        <label
                          htmlFor="modal-file-input"
                          className="block w-full text-center px-4 py-6 bg-slate-950 border border-dashed border-slate-800 rounded-xl cursor-pointer hover:border-emerald-500/50"
                        >
                          <Upload className="mx-auto w-5 h-5 text-slate-400" />
                          <span className="text-sm text-slate-400">{imageUrl ? 'Image Selected' : 'Choose Image'}</span>
                        </label>
                      </div>
                    ) : (
                      <input
                        type="url"
                        placeholder="https://example.com/image.png"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                        required
                      />
                    )}

                    {imageUrl && (
                      <div className="mt-2 w-20 h-20 relative bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                        <Image src={imageUrl} alt="Preview" fill className="object-contain" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Alt Text</label>
                    <input
                      type="text"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="FAQ illustration"
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Position</label>
                    <select
                      value={imagePosition}
                      onChange={(e) => setImagePosition(e.target.value as any)}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                    >
                      <option value="left-top">Left Top</option>
                      <option value="left-bottom">Left Bottom</option>
                      <option value="right-top">Right Top</option>
                      <option value="right-bottom">Right Bottom</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl flex justify-center items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingItem ? 'Update' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
