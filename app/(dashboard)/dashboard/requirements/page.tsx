'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Loader2, Upload, Pencil, ArrowUp, ArrowDown } from 'lucide-react';

interface Step {
  _id: string;
  num: string;
  title: string;
  description: string;
  color: string;
  textColor: string;
  order: number;
  isActive: boolean;
}

interface ImageItem {
  _id: string;
  imageUrl: string;
  alt: string;
  position: 'left' | 'right';
  column: number;
  order: number;
  height: string;
  isActive: boolean;
}

// 🌈 প্রি-ডিফাইন্ড কালার প্যালেট
const COLOR_PALETTES = [
  { bg: 'bg-[#f3e8ff]', text: 'text-[#9333ea]', label: 'Purple' },
  { bg: 'bg-[#dbeafe]', text: 'text-[#2563eb]', label: 'Blue' },
  { bg: 'bg-[#ffedd5]', text: 'text-[#ea580c]', label: 'Orange' },
  { bg: 'bg-[#d1fae5]', text: 'text-[#059669]', label: 'Green' },
  { bg: 'bg-[#fecaca]', text: 'text-[#dc2626]', label: 'Red' },
  { bg: 'bg-[#fef9c3]', text: 'text-[#ca8a04]', label: 'Yellow' },
  { bg: 'bg-[#e0e7ff]', text: 'text-[#4f46e5]', label: 'Indigo' },
  { bg: 'bg-[#fce7f3]', text: 'text-[#db2777]', label: 'Pink' },
];

export default function ManageRequirementsPage() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [itemType, setItemType] = useState<'step' | 'image'>('step');

  // Form state for Step
  const [stepNum, setStepNum] = useState('');
  const [stepTitle, setStepTitle] = useState('');
  const [stepDesc, setStepDesc] = useState('');
  const [stepColor, setStepColor] = useState('bg-[#f3e8ff]');
  const [stepTextColor, setStepTextColor] = useState('text-[#9333ea]');
  const [stepOrder, setStepOrder] = useState(0);

  // Form state for Image
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imagePosition, setImagePosition] = useState<'left' | 'right'>('left');
  const [imageColumn, setImageColumn] = useState(0);
  const [imageHeight, setImageHeight] = useState('h-[150px]');
  const [imageOrder, setImageOrder] = useState(0);
  const [uploadType, setUploadType] = useState<'file' | 'url'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/requirements?type=all');
      const data = await res.json();
      if (data.success) {
        setSteps(data.steps || []);
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
   // Open Modal for Add
  const openAddModal = (type: 'step' | 'image') => {
    setItemType(type);
    setEditingItem(null);
    
    if (type === 'step') {
      setStepNum('');
      setStepTitle('');
      setStepDesc('');
      setStepColor('bg-[#f3e8ff]');
      setStepTextColor('text-[#9333ea]');
      // 🔴 FIX: অটোমেটিক 01, 02 ফরম্যাটে সেট করতে padStart ব্যবহার করা হয়েছে
      setStepOrder(steps.length);
      setStepNum(String(steps.length + 1).padStart(2, '0')); 
    } else {
      setImageUrl('');
      setImageAlt('');
      setImagePosition('left');
      setImageColumn(0);
      setImageHeight('h-[150px]');
      setImageOrder(images.length);
      setUploadType('url');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    
    setModalOpen(true);
  };

  // Open Modal for Edit
  const openEditModal = (item: any, type: 'step' | 'image') => {
    setItemType(type);
    setEditingItem(item);
    
    if (type === 'step') {
      setStepNum(item.num);
      setStepTitle(item.title);
      setStepDesc(item.description);
      setStepColor(item.color);
      setStepTextColor(item.textColor);
      setStepOrder(item.order);
    } else {
      setImageUrl(item.imageUrl);
      setImageAlt(item.alt);
      setImagePosition(item.position);
      setImageColumn(item.column);
      setImageHeight(item.height);
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
      
      if (itemType === 'step') {
        if (!stepNum || !stepTitle || !stepDesc) {
          return alert('Please fill all step fields');
        }
        body = { ...body, num: stepNum, title: stepTitle, description: stepDesc, color: stepColor, textColor: stepTextColor, order: stepOrder };
      } else {
        if (!imageUrl) {
          return alert('Please upload an image');
        }
        body = { ...body, imageUrl: imageUrl, alt: imageAlt, position: imagePosition, column: imageColumn, height: imageHeight, order: imageOrder };
      }

      if (editingItem) {
        body._id = editingItem._id;
      }

      const url = '/api/requirements';
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
        alert(data.message || 'Failed to save');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id: string, type: 'step' | 'image') => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      const res = await fetch(`/api/requirements?id=${id}&type=${type}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Move up/down (reorder)
  const moveItem = async (id: string, type: 'step' | 'image', direction: 'up' | 'down') => {
    const items = type === 'step' ? steps : images;
    const index = items.findIndex(item => item._id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === items.length - 1)) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    
    // Update order numbers
    const updates = newItems.map((item, i) => ({ ...item, order: i }));
    
    try {
      for (const item of updates) {
        await fetch('/api/requirements', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: item._id, type, order: item.order }),
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
          <h1 className="text-2xl font-bold text-slate-100">Manage Requirements</h1>
          <p className="text-slate-400 text-sm mt-1">Manage steps and images for the requirements section.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => openAddModal('step')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} /> Add Step
          </button>
          <button
            onClick={() => openAddModal('image')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} /> Add Image
          </button>
        </div>
      </div>

      {/* Steps Section */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Steps ({steps.length})</h2>
        
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step._id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center gap-4 group hover:border-blue-500/30 transition"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black ${step.color} ${step.textColor} shrink-0`}>
                {step.num}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-200">{step.title}</h4>
                <p className="text-sm text-slate-400">{step.description}</p>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => moveItem(step._id, 'step', 'up')}
                  className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-slate-200"
                  disabled={index === 0}
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => moveItem(step._id, 'step', 'down')}
                  className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-slate-200"
                  disabled={index === steps.length - 1}
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={() => openEditModal(step, 'step')}
                  className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(step._id, 'step')}
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
              <div className={`relative w-full ${img.height} bg-slate-900 rounded-lg overflow-hidden mb-2`}>
                <Image
                  src={img.imageUrl}
                  alt={img.alt || 'Requirement Image'}
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-slate-400">
                  <p>Position: {img.position}</p>
                  <p>Column: {img.column}</p>
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
              {editingItem ? `Edit ${itemType === 'step' ? 'Step' : 'Image'}` : `Add New ${itemType === 'step' ? 'Step' : 'Image'}`}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* STEP FORM */}
              {itemType === 'step' && (
                <>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Step Number</label>
                    <input
                      type="text"
                      value={stepNum}
                      onChange={(e) => setStepNum(e.target.value)}
                      placeholder="01, 02, etc."
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={stepTitle}
                      onChange={(e) => setStepTitle(e.target.value)}
                      placeholder="Floor Plan"
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Description</label>
                    <textarea
                      value={stepDesc}
                      onChange={(e) => setStepDesc(e.target.value)}
                      placeholder="Upload your Floor Plan..."
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 resize-none"
                      required
                    />
                  </div>

                  {/* 🎨 নতুন কালার প্যালেট সিলেক্টর */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Choose Color Theme</label>
                    <div className="grid grid-cols-4 gap-2">
                      {COLOR_PALETTES.map((palette) => (
                        <button
                          key={palette.label}
                          type="button"
                          onClick={() => {
                            setStepColor(palette.bg);
                            setStepTextColor(palette.text);
                          }}
                          className={`h-10 rounded-xl border-2 transition-all flex items-center justify-center ${
                            stepColor === palette.bg && stepTextColor === palette.text
                              ? 'border-white ring-2 ring-emerald-400'
                              : 'border-transparent hover:border-slate-600'
                          }`}
                        >
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${palette.bg} ${palette.text}`}>
                            {palette.label}
                          </span>
                        </button>
                      ))}
                    </div>
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
                      placeholder="Floor plan example"
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Position</label>
                      <select
                        value={imagePosition}
                        onChange={(e) => setImagePosition(e.target.value as 'left' | 'right')}
                        className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                      >
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Column</label>
                      <select
                        value={imageColumn}
                        onChange={(e) => setImageColumn(Number(e.target.value))}
                        className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                      >
                        <option value={0}>Column 0</option>
                        <option value={1}>Column 1</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Height Class</label>
                    <input
                      type="text"
                      value={imageHeight}
                      onChange={(e) => setImageHeight(e.target.value)}
                      placeholder="h-[150px]"
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                    />
                  </div>
                </>
              )}

              {/* Buttons */}
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