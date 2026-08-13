// app/dashboard/settings/page.tsx
'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/settings/logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logoUrl }),
    });

    if (res.ok) {
      alert('Logo updated successfully!');
      setLogoUrl('');
    } else {
      alert('Failed to update logo!');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Site Settings</h2>
        <p className="text-slate-400 text-sm">Update your website logo and global configurations.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            New Logo Image Path / URL
          </label>
          <input
            type="text"
            placeholder="e.g. /logo2.png or Cloudinary Link"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-5 py-2.5 rounded-xl text-sm transition"
        >
          {loading ? 'Updating...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}