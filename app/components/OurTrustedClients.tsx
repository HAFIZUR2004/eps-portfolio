'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface ClientLogo {
  _id: string;
  name: string;
  logoSrc: string; // বা logoUrl
}

export default function OurTrustedClients() {
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/clients');
        const data = await res.json();

        if (data?.success && Array.isArray(data.clients)) {
          setClients(data.clients);
        } else {
          setClients([]);
        }
      } catch (error) {
        console.error('Failed to fetch client logos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // অনবরত লুপ (Infinite Marquee) চালানোর জন্য অ্যারে ডুপ্লিকেট করা
  // পর্যাপ্ত আইটেম না থাকলে মসৃণ লুপের জন্য ২/৩ বার ডুপ্লিকেট করা ভালো
  const duplicatedLogos = clients.length > 0 
    ? [...clients, ...clients, ...clients] 
    : [];

  if (loading) {
    return (
      <section className="py-10 bg-white border-t border-gray-100 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
      </section>
    );
  }

  // যদি ড্যাশবোর্ড থেকে কোনো লোগো এড না করা হয়ে থাকে
  if (clients.length === 0) {
    return null; 
  }

  return (
    <section className="py-10 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Heading */}
        <div className="mb-8 flex items-center justify-center gap-4">
          {/* Left Decoration */}
          <div className="relative h-7 w-7 shrink-0">
            <span className="absolute left-0 top-0 h-6 w-6 rounded-full bg-[#FF3B1D]" />
            <span className="absolute right-0 top-1 z-10 h-4 w-4 rounded-full bg-[#006A4E]" />
          </div>

          {/* Heading */}
          <div className="flex items-center gap-3">
            <h2 className="whitespace-nowrap text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Our Valuable Clients
            </h2>
          </div>

          {/* Right Decoration */}
          <div className="relative h-7 w-7 shrink-0">
            <span className="absolute left-0 top-1 z-10 h-4 w-4 rounded-full bg-[#006A4E]" />
            <span className="absolute right-0 top-0 h-6 w-6 rounded-full bg-[#FF3B1D]" />
          </div>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden">
          
          {/* Side Gradients for Smooth Fade Effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Infinite Moving Track */}
          <div className="animate-marquee flex items-center gap-12 md:gap-20 py-2">
            {duplicatedLogos.map((client, index) => (
              <div
                key={`${client._id}-${index}`}
                className="relative h-10 w-32 md:w-40 shrink-0 opacity-80 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
              >
                <Image
                  src={client.logoSrc || '/placeholder.png'}
                  alt={client.name || 'Client Logo'}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 128px, 160px"
                />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}