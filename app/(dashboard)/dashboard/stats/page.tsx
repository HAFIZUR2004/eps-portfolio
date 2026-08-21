'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 1. Stat Item Interface definining
interface StatItem {
  label: string;
  target: number;
}

export default function StatsDashboardPage() {
  // 2. Explicitly type the array as StatItem[]
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const router = useRouter();

  // =========================================================
  // FETCH STATS FROM API
  // =========================================================
  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stats', { cache: 'no-store' });
      
      if (!res.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await res.json();

      if (data.success) {
        setStats(data.data.stats);
      } else {
        // Fallback data
        setStats([
          { label: 'Works Done', target: 100 },
          { label: 'Happy Clients', target: 150 },
          { label: 'Countries', target: 20 },
        ]);
        setMessage('Using default stats. API not responding.');
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
      // Fallback data
      setStats([
        { label: 'Works Done', target: 100 },
        { label: 'Happy Clients', target: 150 },
        { label: 'Countries', target: 20 },
      ]);
      setMessage('Using default stats. API not available.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // =========================================================
  // HANDLE STATS CHANGES (Typed Parameters)
  // =========================================================
  const handleStatsChange = (
    index: number,
    field: 'label' | 'target',
    value: string
  ) => {
    const updatedStats = [...stats];
    if (field === 'label') {
      updatedStats[index].label = value;
    } else if (field === 'target') {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 0) {
        updatedStats[index].target = numValue;
      }
    }
    setStats(updatedStats);
  };

  // =========================================================
  // ADD NEW STAT
  // =========================================================
  const addStats = () => {
    setStats([...stats, { label: 'New Stat', target: 0 }]);
  };

  // =========================================================
  // REMOVE STAT
  // =========================================================
  const removeStats = (index: number) => {
    if (stats.length <= 1) {
      setMessage('At least one stat is required');
      return;
    }
    const updatedStats = stats.filter((_, i) => i !== index);
    setStats(updatedStats);
  };

  // =========================================================
  // SAVE STATS TO API
  // =========================================================
  const saveStats = async () => {
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stats }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Stats updated successfully!');
        await fetchStats();
      } else {
        setMessage(`❌ ${data.message || 'Failed to update stats'}`);
      }
    } catch (error) {
      console.error('Save stats error:', error);
      setMessage('❌ Failed to save stats');
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // RESET TO DEFAULT STATS
  // =========================================================
  const resetStats = () => {
    if (confirm('Are you sure you want to reset to default stats?')) {
      setStats([
        { label: 'Works Done', target: 100 },
        { label: 'Happy Clients', target: 150 },
        { label: 'Countries', target: 20 },
      ]);
      setMessage('Default stats loaded. Click Save to apply.');
    }
  };

  // =========================================================
  // LOADING STATE
  // =========================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stats dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              📊 Stats Counter Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage the statistics displayed on the Hero Section
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            ← Back to Home
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' :
            message.includes('❌') ? 'bg-red-50 text-red-700 border border-red-200' :
            'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {message}
          </div>
        )}

        {/* Stats Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-[#006A4E] px-6 py-4">
            <h2 className="text-lg font-semibold text-white">
              Statistics Counters
            </h2>
            <p className="text-sm text-[#a8d5c9] mt-1">
              Update the numbers and labels
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  {/* Label Input */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) =>
                        handleStatsChange(index, 'label', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                      placeholder="e.g. Works Done"
                    />
                  </div>

                  {/* Target Input */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Target Number
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={stat.target}
                      onChange={(e) =>
                        handleStatsChange(index, 'target', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                      placeholder="e.g. 100"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeStats(index)}
                    className="self-end sm:self-center px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                    disabled={stats.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Stat Button */}
            <button
              onClick={addStats}
              className="mt-4 w-full py-3 text-sm font-semibold text-[#006A4E] border-2 border-[#006A4E] rounded-md hover:bg-[#006A4E] hover:text-white"
            >
              + Add New Statistic
            </button>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={saveStats}
              disabled={saving}
              className="flex-1 py-3 text-sm font-semibold text-white bg-[#006A4E] rounded-md hover:bg-[#005a42] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              onClick={resetStats}
              className="flex-1 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Reset to Default
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-800 px-6 py-4">
            <h3 className="text-lg font-semibold text-white">
              👁️ Live Preview
            </h3>
          </div>
          <div className="p-6">
            <div className="bg-[#eee4de] rounded-xl p-8">
              <div className="mx-auto max-w-[800px]">
                <div className="mx-auto mt-8 h-[65px] w-[75%] rounded-full bg-white shadow-[0_5px_3px_rgba(0,0,0,0.12)] sm:mt-10 sm:h-[75px] sm:w-[70%] lg:mt-8 lg:w-[72%] flex items-center justify-around px-4 sm:px-8">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center text-center"
                    >
                      <span className="text-base font-black text-slate-900 sm:text-xl lg:text-2xl">
                        {stat.target}+
                      </span>
                      <span className="text-[9px] font-semibold text-slate-700 sm:text-xs">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}