// src/components/OurTrustedClients.tsx
import Image from 'next/image';

interface ClientLogo {
  id: number;
  name: string;
  logoSrc: string;
}

const clientLogos: ClientLogo[] = [
  { id: 1, name: 'Find My SDA', logoSrc: '/hi.png' },
  { id: 2, name: 'Firegy', logoSrc: '/hi.png' },
  { id: 3, name: 'Vista Fire Protection', logoSrc: '/hi.png' },
  { id: 4, name: 'Fire Alarm Guys', logoSrc: '/hi.png' },
  { id: 5, name: 'Fire Protect Riviera', logoSrc: '/hi.png' },
];

export default function OurTrustedClients() {
  return (
    <section className="py-14 bg-white border-t border-gray-100 px-4">
      <div className="max-w-6xl mx-auto text-center">
        
        {/* Section Heading with Image-Matched Overlapping Dots */}
         <div className="mb-10 flex items-center justify-center gap-4">

          {/* Left Decoration */}
          <div className="relative h-8 w-8 shrink-0">

            {/* Red Circle */}
            <span className="absolute left-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />

            {/* Green Overlapping Circle */}
            <span className="absolute right-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
          </div>

          {/* Heading */}
          <h2 className="whitespace-nowrap text-3xl font-bold tracking-tight text-black md:text-4xl">
            Our Trusted Clients

          </h2>

          {/* Right Decoration */}
          <div className="relative h-8 w-8 shrink-0">

            {/* Green Overlapping Circle */}
            <span className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />

            {/* Red Circle */}
            <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
          </div>
        </div>


        {/* Logos Grid */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-90 grayscale hover:grayscale-0 transition-all duration-300">
          {clientLogos.map((client) => (
            <div key={client.id} className="relative h-12 w-36 sm:w-44 flex items-center justify-center">
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
    </section>
  );
}