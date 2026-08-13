// src/components/OurTrustedClients.tsx
import Image from 'next/image';

interface ClientLogo {
  id: number;
  name: string;
  logoSrc: string;
}

const clientLogos: ClientLogo[] = [
  { id: 1, name: 'Find My SDA', logoSrc: '/trust.png' },
  { id: 2, name: 'Firegy', logoSrc: '/trust.png' },
  { id: 3, name: 'Vista Fire Protection', logoSrc: '/trust.png' },
  { id: 4, name: 'Fire Alarm Guys', logoSrc: '/trust.png' },
  { id: 5, name: 'Fire Protect Riviera', logoSrc: '/trust.png' },
];

export default function OurTrustedClients() {
  // অনবরত লুপ চালানোর জন্য লোগো অ্যারে জোড়া দেওয়া হয়েছে
  const duplicatedLogos = [...clientLogos, ...clientLogos];

  return (
    <section className="py-10 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Heading with Image-Matched Overlapping Dots */}
        <div className="mb-8 flex items-center justify-center gap-4">

          {/* Left Decoration */}
          <div className="relative h-7 w-7 shrink-0">
            <span className="absolute left-0 top-0 h-6 w-6 rounded-full bg-[#FF3B1D]" />
            <span className="absolute right-0 top-1 z-10 h-4 w-4 rounded-full bg-[#006A4E]" />
          </div>

          {/* Heading with News Badge */}
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

        {/* Breaking News Style Ticker / Marquee Container */}
        <div className="relative w-full overflow-hidden mask-linear-gradient">
          
          {/* Side Gradients for Smooth Fade Effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Infinite Moving Track */}
          <div className="animate-marquee flex items-center gap-12 md:gap-20 py-2">
            {duplicatedLogos.map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="relative h-10 w-32 md:w-40 shrink-0 opacity-80 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
              >
                <Image
                  src={client.logoSrc}
                  alt={client.name}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}