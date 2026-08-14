'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Loader2, Upload, Link as LinkIcon } from 'lucide-react';

interface ClientLogo {
  _id: string;
  logoSrc: string;
}

export default function ManageClientsPage() {
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [logoSrc, setLogoSrc] = useState('');
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/clients');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (data.success) {
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error('Failed to fetch clients', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/png') {
        alert('Please select a PNG image only.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoSrc) return alert('Please upload an image or provide a valid URL');

    try {
      setSubmitting(true);
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoSrc }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLogoSrc('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchClients();
      } else {
        alert(data.message || 'Failed to upload logo');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Check server logs or image size.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this logo?')) return;

    try {
      const res = await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setClients((prev) => prev.filter((c) => c._id !== id));
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
        <h1 className="text-2xl font-bold text-slate-100">Manage Client Logos</h1>
        <p className="text-slate-400 text-sm mt-1">
          Upload transparent PNG logos for your homepage showcase section.
        </p>
      </div>

      {/* UPLOAD FORM */}
      <form 
        onSubmit={handleAddClient} 
        className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-5"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-200">Upload New Logo</h2>
          
          {/* Toggle File / URL */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => { setUploadType('file'); setLogoSrc(''); }}
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
              onClick={() => { setUploadType('url'); setLogoSrc(''); }}
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
              accept="image/png"
              onChange={handleFileChange}
              className="hidden"
              id="client-logo-file"
            />
            <label
              htmlFor="client-logo-file"
              className="w-full flex items-center justify-center gap-2 px-4 py-8 bg-slate-950 border border-dashed border-slate-800 hover:border-emerald-500/50 rounded-xl text-slate-400 cursor-pointer transition text-sm group"
            >
              <Upload className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition" />
              <span>{logoSrc ? 'Change PNG Image' : 'Choose PNG Image (Max 2MB)'}</span>
            </label>
          </div>
        ) : (
          <input
            type="url"
            placeholder="https://example.com/logo.png"
            value={logoSrc}
            onChange={(e) => setLogoSrc(e.target.value)}
            required={uploadType === 'url'}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm"
          />
        )}

        {/* Preview */}
        {logoSrc && (
          <div className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="relative w-12 h-12 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
              <Image src={logoSrc} alt="Preview" fill className="object-contain p-1" />
            </div>
            <div className="text-xs text-slate-400">
              <p className="font-semibold text-slate-300">Logo Ready to Upload</p>
              <p className="text-slate-500 truncate max-w-xs">{logoSrc.substring(0, 40)}...</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-xl transition flex items-center gap-2 text-sm"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Upload Logo
        </button>
      </form>

      {/* LOGO GRID */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Current Client Logos</h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
          </div>
        ) : clients.length === 0 ? (
          <p className="text-slate-500 text-sm py-4">No logos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {clients.map((client) => (
              <div 
                key={client._id} 
                className="relative group border border-slate-800/80 rounded-xl p-4 flex items-center justify-center bg-slate-950 hover:border-slate-700 transition h-28"
              >
                <div className="relative w-full h-16">
                  <Image
                    src={client.logoSrc}
                    alt="Client Logo"
                    fill
                    className="object-contain"
                  />
                </div>

                <button
                  onClick={() => handleDelete(client._id)}
                  className="absolute top-2 right-2 p-1.5 bg-rose-500/10 text-rose-400 rounded-lg opacity-0 group-hover:opacity-100 transition hover:bg-rose-500/20 border border-rose-500/20"
                  title="Delete Logo"
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