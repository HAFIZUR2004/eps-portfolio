'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Loader2, Upload, Pencil, ArrowUp, ArrowDown } from 'lucide-react';

interface FAQItem { _id: string; id: string; question: string; answer: string; order: number; isActive: boolean; }
interface FAQImage { _id: string; imageUrl: string; alt: string; position: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom'; order: number; isActive: boolean; }
interface ModalState { open: boolean; type: 'faq' | 'image'; editing: any; }

export default function Page() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [images, setImages] = useState<FAQImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState<ModalState>({ open: false, type: 'faq', editing: null });
  const [faqForm, setFaqForm] = useState({ id: '', question: '', answer: '', order: 0 });
  const [imgForm, setImgForm] = useState({ imageUrl: '', alt: '', position: 'left-top' as any, order: 0 });
  const [uploadType, setUploadType] = useState<'file' | 'url'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/faq?type=all');
      const data = await res.json();
      if (data.success) { setFaqs(data.faqs || []); setImages(data.images || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('File size should be less than 5MB'); if (fileInputRef.current) fileInputRef.current.value = ''; return; }
    const reader = new FileReader();
    reader.onloadend = () => setImgForm(prev => ({ ...prev, imageUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const openAddModal = (type: 'faq' | 'image') => {
    setModal({ open: true, type, editing: null });
    if (type === 'faq') setFaqForm({ id: String(faqs.length + 1).padStart(2, '0'), question: '', answer: '', order: faqs.length });
    else { setImgForm({ imageUrl: '', alt: '', position: 'left-top', order: images.length }); setUploadType('url'); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const openEditModal = (item: any, type: 'faq' | 'image') => {
    setModal({ open: true, type, editing: item });
    if (type === 'faq') setFaqForm({ id: item.id, question: item.question, answer: item.answer, order: item.order });
    else setImgForm({ imageUrl: item.imageUrl, alt: item.alt, position: item.position, order: item.order });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal.type) return;
    setSubmitting(true);
    try {
      const body: any = { type: modal.type, data: modal.type === 'faq' ? faqForm : imgForm };
      if (modal.editing) body.id = modal.editing._id;
      const res = await fetch('/api/faq', { method: modal.editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok && data.success) { setModal({ open: false, type: 'faq', editing: null }); fetchData(); }
      else alert(data.error || 'Failed to save');
    } catch (e) { console.error(e); alert('Failed to save'); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string, type: 'faq' | 'image') => {
    if (!confirm(`Delete this ${type}?`)) return;
    try {
      const res = await fetch(`/api/faq?type=${type}&id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchData(); else alert(data.error || 'Failed to delete');
    } catch (e) { console.error(e); }
  };

  const moveItem = async (id: string, type: 'faq' | 'image', direction: 'up' | 'down') => {
    const items = type === 'faq' ? faqs : images;
    const index = items.findIndex(i => i._id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === items.length - 1)) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...items]; [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    try {
      for (const item of newItems) await fetch('/api/faq', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, id: item._id, data: { order: newItems.indexOf(item) } }) });
      fetchData();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="max-w-6xl mx-auto p-6"><div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div></div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-slate-100">Manage FAQ</h1><p className="text-slate-400 text-sm mt-1">Manage FAQs and images.</p></div>
        <div className="flex gap-3">
          <button onClick={() => openAddModal('faq')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Plus size={18} /> Add FAQ</button>
          <button onClick={() => openAddModal('image')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Plus size={18} /> Add Image</button>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">FAQs ({faqs.length})</h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={faq._id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center gap-4 group hover:border-blue-500/30 transition">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold shrink-0">{faq.id}</div>
              <div className="flex-1"><h4 className="font-semibold text-slate-200">{faq.question}</h4><p className="text-sm text-slate-400 line-clamp-2">{faq.answer}</p></div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => moveItem(faq._id, 'faq', 'up')} disabled={index === 0} className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-slate-200"><ArrowUp size={16} /></button>
                <button onClick={() => moveItem(faq._id, 'faq', 'down')} disabled={index === faqs.length - 1} className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-slate-200"><ArrowDown size={16} /></button>
                <button onClick={() => openEditModal(faq, 'faq')} className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(faq._id, 'faq')} className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 border border-rose-500/20"><Trash2 size={16} /></button>
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
              <div className="relative w-full h-[150px] bg-slate-900 rounded-lg overflow-hidden mb-2"><Image src={img.imageUrl} alt={img.alt || 'FAQ Image'} fill className="object-contain" /></div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-slate-400"><p>Position: {img.position}</p></div>
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
              
              {modal.type === 'faq' && (
                <>
                  <input type="text" placeholder="ID" value={faqForm.id} onChange={e => setFaqForm({ ...faqForm, id: e.target.value })} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200" required />
                  <input type="text" placeholder="Question" value={faqForm.question} onChange={e => setFaqForm({ ...faqForm, question: e.target.value })} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200" required />
                  <textarea placeholder="Answer" value={faqForm.answer} onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })} rows={4} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 resize-none" required />
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
                      <label htmlFor="modal-file-input" className="block w-full text-center px-4 py-6 bg-slate-950 border border-dashed border-slate-800 rounded-xl cursor-pointer hover:border-emerald-500/50"><Upload className="mx-auto w-5 h-5 text-slate-400" /><span className="text-sm text-slate-400">{imgForm.imageUrl ? 'Image Selected' : 'Choose Image'}</span></label>
                    </div>
                  ) : (
                    <input type="url" placeholder="https://example.com/image.png" value={imgForm.imageUrl} onChange={e => setImgForm({ ...imgForm, imageUrl: e.target.value })} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200" required />
                  )}
                  {imgForm.imageUrl && <div className="mt-2 w-20 h-20 relative bg-slate-900 rounded-lg overflow-hidden border border-slate-800"><Image src={imgForm.imageUrl} alt="Preview" fill className="object-contain" /></div>}
                  <input type="text" placeholder="Alt Text" value={imgForm.alt} onChange={e => setImgForm({ ...imgForm, alt: e.target.value })} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200" />
                  <select value={imgForm.position} onChange={e => setImgForm({ ...imgForm, position: e.target.value as any })} className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200">
                    <option value="left-top">Left Top</option><option value="left-bottom">Left Bottom</option><option value="right-top">Right Top</option><option value="right-bottom">Right Bottom</option>
                  </select>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal({ open: false, type: 'faq', editing: null })} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl flex justify-center items-center gap-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (modal.editing ? 'Update' : 'Add')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}