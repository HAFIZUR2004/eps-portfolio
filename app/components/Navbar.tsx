'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // 👈 Active Route ট্র্যাক করার জন্য
import { UserButton, useUser } from '@clerk/nextjs';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logo, setLogo] = useState('/logo2.png'); // Default logo
  const { user, isSignedIn, isLoaded } = useUser();
  const pathname = usePathname(); // 👈 বর্তমান পেজের পাথ বা URL পাওয়া যাবে

  // Admin Check
  const isAdmin = user?.publicMetadata?.role === 'admin';

  // Navigation Links Data Array
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  // 🔄 MongoDB থেকে ডাইনামিক লোগো ফেচ করা
  useEffect(() => {
    async function fetchLogo() {
      try {
        const res = await fetch('/api/settings/logo');
        const data = await res.json();
        if (data?.logoUrl) {
          setLogo(data.logoUrl);
        }
      } catch (err) {
        console.error('Failed to fetch dynamic logo:', err);
      }
    }
    fetchLogo();
  }, []);

  return (
    <header className="bg-[#f4f1eb] py-4 px-6 md:px-12 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Dynamic Logo Section */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logo}
            alt="Evacuation Plan Service Logo"
            width={160}
            height={60}
            className="object-contain h-12 w-auto md:h-14"
            priority
          />
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8 text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href; // 👈 চেক করা হচ্ছে লিঙ্কটি অ্যাক্টিভ কি না
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors duration-200 font-medium ${
                  isActive
                    ? 'text-[#ff5722] font-bold border-b-2 border-[#ff5722] pb-1'
                    : 'text-gray-700 hover:text-[#ff5722]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Admin Dashboard Link */}
          {isLoaded && isSignedIn && isAdmin && (
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                pathname.startsWith('/dashboard')
                  ? 'bg-[#ff5722] text-white shadow-sm'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3 min-h-[36px]">
          {!isLoaded ? (
            <div className="w-20 h-8 bg-gray-200/60 animate-pulse rounded-md"></div>
          ) : isSignedIn ? (

      <UserButton />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-gray-700 hover:text-[#ff5722] px-4 py-2 font-medium text-sm transition"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="bg-[#ff5722] text-white px-5 py-2 rounded-md shadow-sm hover:bg-[#e04d1c] transition duration-200 font-medium text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Hamburger Icon */}
        <button
          className="block md:hidden text-gray-800 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-white p-4 rounded-lg shadow-lg flex flex-col space-y-3 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#ff5722]/10 text-[#ff5722] font-bold'
                    : 'text-gray-700 hover:text-[#ff5722] hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Mobile Admin Dashboard Link */}
          {isLoaded && isSignedIn && isAdmin && (
            <Link
              href="/dashboard"
              className={`w-full text-center py-2 rounded-md text-sm font-semibold transition ${
                pathname.startsWith('/dashboard')
                  ? 'bg-[#ff5722] text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {/* Mobile Auth Buttons */}
          {isLoaded && (
            isSignedIn ? (
              <div className="pt-2">
                <UserButton />
              </div>
            ) : (
              <div className="flex flex-col w-full gap-2 pt-2 border-t border-gray-100">
                <Link
                  href="/sign-in"
                  className="w-full text-center border border-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className="w-full text-center bg-[#ff5722] text-white py-2 rounded-md shadow-sm hover:bg-[#e04d1c] transition text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )
          )}
        </div>
      )}
    </header>
  );
}