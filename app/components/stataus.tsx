"use client";
import React, { useState, useEffect } from 'react';

const Stats = () => {
  const [statsData, setStatsData] = useState([
    { label: 'Works Done', target: 100 },
    { label: 'Happy Clients', target: 150 },
    { label: 'Countries', target: 20 },
  ]);
  const [counts, setCounts] = useState(statsData.map(() => 0));
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH STATS FROM API (Dashboard থেকে)
  // =========================================================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' });

        if (!res.ok) {
          throw new Error('Failed to fetch stats');
        }

        const data = await res.json();

        if (data.success) {
          setStatsData(data.data?.stats || [
            { label: 'Works Done', target: 100 },
            { label: 'Happy Clients', target: 150 },
            { label: 'Countries', target: 20 },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback data if API fails
        setStatsData([
          { label: 'Works Done', target: 100 },
          { label: 'Happy Clients', target: 150 },
          { label: 'Countries', target: 20 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // =========================================================
  // COUNTER ANIMATION (1, 2, 3, 4... এভাবে বাড়বে)
  // =========================================================
  useEffect(() => {
    if (loading) return; // Wait for stats to load

    const duration = 2000; // 2 সেকেন্ডে শেষ হবে
    const stepTime = 20; // প্রতি 20ms আপডেট
    const totalSteps = duration / stepTime;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / totalSteps;

      setCounts((prev) =>
        prev.map((_, index) => {
          const target = statsData[index].target;
          return Math.min(Math.floor(progress * target), target);
        })
      );

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setCounts(statsData.map((d) => d.target));
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [statsData, loading]);

  // =========================================================
  // LOADING STATE
  // =========================================================
  if (loading) {
    return (
      <div className="w-full bg-[#eee4de] py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        mx-auto
        mt-8

        h-[65px]

        w-[75%]

        rounded-full

        bg-white

        shadow-[0_5px_3px_rgba(0,0,0,0.12)]

        sm:mt-10
        sm:h-[75px]
        sm:w-[70%]

        lg:mt-8
        lg:w-[72%]

        flex
        items-center
        justify-around
        px-4
        sm:px-8
      "
    >
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center text-center"
        >
          <span className="text-base font-black text-slate-900 sm:text-xl lg:text-2xl">
            {counts[index]}+
          </span>
          <span className="text-[9px] font-semibold text-slate-700 sm:text-xs">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Stats;