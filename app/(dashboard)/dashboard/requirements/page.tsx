'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Loader2, Upload, Pencil, ArrowUp, ArrowDown } from 'lucide-react';

interface Step { _id: string; num: string; title: string; description: string; color: string; textColor: string; order: number; isActive: boolean; }
interface ImageItem { _id: string; imageUrl: string; alt: string; position: 'left' | 'right'; column: number; order: number; height: string; isActive: boolean; }
interface ModalState { open: boolean; type: 'step' | 'image'; editing: any; }

const COLORS = [
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
  const [uploadingImg, setUploadingImg] = useState(false);
  const [modal, setModal] = useState<ModalState>({ open: false, type: 'step', editing: null });

  // Form states
  const [stepForm, setStepForm] = useState({ num: '', title: '', description: '', color: COLORS[0].bg, textColor: COLORS[0].text, order: 0 });
  const [imgForm, setImgForm] = useState({ imageUrl: '', alt: '', position: 'left' as 'left' | 'right', column: 0, height: 'h-[150px]', order: 0 });
  const [uploadType, setUploadType] = useState<'file' | 'url'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/requirements?type=all');
      const data = await res.json();
      if (data.success) { setSteps(data.steps || []); setImages(data.images || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // Cloudinary / External Cloud File Handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { 
      alert('File size should be less than 5MB'); 
      if (fileInputRef.current) fileInputRef.current.value = ''; 
      return; 
    }

    try {
      setUploadingImg(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'your_cloudinary_preset'); // Replace with your preset or custom API endpoint

      const res = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setImgForm(prev => ({ ...prev, imageUrl: data.secure_url }));
      } else {
        alert('Image upload failed');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      alert('Image upload failed');
    } finally {
      setUploadingImg(false);
    }
  };

  const openAddModal = (type: 'step' | 'image') => {
    setModal({ open: true, type, editing: null });
    if (type === 'step') setStepForm({ num: String(steps.length + 1).padStart(2, '0'), title: '', description: '', color: COLORS[0].bg, textColor: COLORS[0].text, order: steps.length });
    else { setImgForm({ imageUrl: '', alt: '', position: 'left', column: 0, height: 'h-[150px]', order: images.length }); setUploadType('url'); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const openEditModal = (item: any, type: 'step' | 'image') => {
    setModal({ open: true, type, editing: item });
    if (type === 'step') setStepForm({ num: item.num, title: item.title, description: item.description, color: item.color, textColor: item.textColor, order: item.order });
    else setImgForm({ imageUrl: item.imageUrl, alt: item.alt, position: item.position, column: item.column, height: item.height, order: item.order });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modal.type === 'image' && !imgForm.imageUrl) {
      alert('Please upload or provide an image URL');
      return;
    }
    setSubmitting(true);
    try {
      const body: any = { type: modal.type, ...(modal.type === 'step' ? stepForm : imgForm) };
      if (modal.editing) body._id = modal.editing._id;
      const res = await fetch('/api/requirements', { method: modal.editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok && data.success) { setModal({ open: false, type: 'step', editing: null }); fetchData(); }
      else alert(data.message || 'Failed to save');
    } catch (e) { console.error(e); alert('Failed to save'); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string, type: 'step' | 'image') => {
    if (!confirm(`Delete this ${type}?`)) return;
    try {
      const res = await fetch(`/api/requirements?id=${id}&type=${type}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchData(); else alert(data.message || 'Failed to delete');
    } catch (e) { console.error(e); }
  };

  const moveItem = async (id: string, type: 'step' | 'image', direction: 'up' | 'down') => {
    const items = type === 'step' ? steps : images;
    const index = items.findIndex(i => i._id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === items.length - 1)) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...items]; [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    try {
      for (const item of newItems) await fetch('/api/requirements', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: item._id, type, order: newItems.indexOf(item) }) });
      fetchData();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="max-w-6xl mx-auto p-6"><div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div></div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-slate-100">Manage Requirements</h1><p className="text-slate-400 text-sm mt-1">Manage steps and images.</p></div>
        <div className="flex gap-3">
          <button onClick={() => openAddModal('step')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Plus size={18} /> Add Step</button>
          <button onClick={() => openAddModal('image')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Plus size={18} /> Add Image</button>
        </div>
      </div>

      {/* Steps Section */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Steps ({steps.length})</h2>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step._id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center gap-4 group hover:border-blue-500/30 transition">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black ${step.color} ${step.textColor} shrink-0`}>{step.num}</div>
              <div className="flex-1"><h4 className="font-semibold text-slate-200">{step.title}</h4><p className="text-sm text-slate-400">{step.description}</p></div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => moveItem(step._id, 'step', 'up')} disabled={index === 0} className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-slate-200"><ArrowUp size={16} /></button>
                <button onClick={() => moveItem(step._id, 'step', 'down')} disabled={index === steps.length - 1} className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-slate-200"><ArrowDown size={16} /></button>
                <button onClick={() => openEditModal(step, 'step')} className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(step._id, 'step')} className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 border border-rose-500/20"><Trash2 size={16} /></button>
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
            <div key={img._id} className="relative bg-slate-950 border border-slate-800 rounded-xl p-3 group hover:border-emerald-500/30 transition">
              <div className={`relative w-full ${img.height} bg-slate-900 rounded-lg overflow-hidden mb-2`}><Image src={img.imageUrl} alt={img.alt || 'Requirement Image'} fill className="object-contain" /></div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-slate-400"><p>Position: {img.position}</p><p>Column: {img.column}</p></div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => moveItem(img._id, 'image', 'up')} disabled={index === 0} className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-slate-200"><ArrowUp size={16} /></button>
                  <button onClick={() => moveItem(img._id, 'image', 'down')} disabled={index === images.length - 1} className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-slate-200"><ArrowDown size={16} /></button>
                  <button onClick={() => openEditModal(img, 'image')} className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(img._id, 'image')} className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 border border-rose-500/20"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-200 mb-4">{modal.editing ? `Edit ${modal.type}` : `Add New ${modal.type}`}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {modal.type === 'step' && (
                <>
                  <input type="text" placeholder="Step Number" value={stepForm.num} onChange={e => setStepForm({ ...stepForm, num: e.target.value })} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200" required />
                  <input type="text" placeholder="Title" value={stepForm.title} onChange={e => setStepForm({ ...stepForm, title: e.target.value })} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200" required />
                  <textarea placeholder="Description" value={stepForm.description} onChange={e => setStepForm({ ...stepForm, description: e.target.value })} rows={3} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 resize-none" required />
                  <div className="grid grid-cols-4 gap-2">
                    {COLORS.map(c => (
                      <button key={c.label} type="button" onClick={() => setStepForm({ ...stepForm, color: c.bg, textColor: c.text })} className={`h-10 rounded-xl border-2 transition-all ${stepForm.color === c.bg ? 'border-white ring-2 ring-emerald-400' : 'border-transparent hover:border-slate-600'}`}><span className={`text-xs font-bold px-2 py-1 rounded-md ${c.bg} ${c.text}`}>{c.label}</span></button>
                    ))}
                  </div>
                </>
              )}

              {modal.type === 'image' && (
                <>
                  <div className="flex gap-2 mb-2">
                    <button type="button" onClick={() => { setUploadType('file'); setImgForm({ ...imgForm, imageUrl: '' }); }} className={`text-xs px-3 py-1 rounded ${uploadType === 'file' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500'}`}>File</button>
                    <button type="button" onClick={() => { setUploadType('url'); setImgForm({ ...imgForm, imageUrl: '' }); }} className={`text-xs px-3 py-1 rounded ${uploadType === 'url' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500'}`}>URL</button>
                  </div>
                  {uploadType === 'file' ? (
                    <div>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="modal-file-input" />
                      <label htmlFor="modal-file-input" className="block w-full text-center px-4 py-6 bg-slate-950 border border-dashed border-slate-800 rounded-xl cursor-pointer hover:border-emerald-500/50">
                        <Upload className="mx-auto w-5 h-5 text-slate-400" />
                        <span className="text-sm text-slate-400">{uploadingImg ? 'Uploading...' : imgForm.imageUrl ? 'Image Uploaded' : 'Choose Image'}</span>
                      </label>
                    </div>
                  ) : (
                    <input type="url" placeholder="https://example.com/image.png" value={imgForm.imageUrl} onChange={e => setImgForm({ ...imgForm, imageUrl: e.target.value })} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200" required />
                  )}
                  {imgForm.imageUrl && <div className="mt-2 w-20 h-20 relative bg-slate-900 rounded-lg overflow-hidden border border-slate-800"><Image src={imgForm.imageUrl} alt="Preview" fill className="object-contain" /></div>}
                  <input type="text" placeholder="Alt Text" value={imgForm.alt} onChange={e => setImgForm({ ...imgForm, alt: e.target.value })} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200" />
                  <div className="grid grid-cols-2 gap-4">
                    <select value={imgForm.position} onChange={e => setImgForm({ ...imgForm, position: e.target.value as 'left' | 'right' })} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"><option value="left">Left</option><option value="right">Right</option></select>
                    <select value={imgForm.column} onChange={e => setImgForm({ ...imgForm, column: Number(e.target.value) })} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"><option value={0}>Column 0</option><option value={1}>Column 1</option></select>
                  </div>
                  <input type="text" placeholder="h-[150px]" value={imgForm.height} onChange={e => setImgForm({ ...imgForm, height: e.target.value })} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200" />
                </>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal({ open: false, type: 'step', editing: null })} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700">Cancel</button>
                <button type="submit" disabled={submitting || uploadingImg} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl flex justify-center items-center gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (modal.editing ? 'Update' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}