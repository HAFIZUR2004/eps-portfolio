'use client'; // ক্লিক ইভেন্ট (মোবাইল মেনু) হ্যান্ডেল করার জন্য

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[#f4f1eb] py-4 px-6 md:px-12 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2">
          {/* একটি SVG আইকন ব্যবহার করছি (আপনি আপনার ইমেজ ব্যবহার করতে পারেন) */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L20 12L16 22L12 12L16 2Z" fill="#FF5722" />
            <circle cx="16" cy="16" r="12" stroke="#333" strokeWidth="1" />
          </svg>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-green-700 text-sm tracking-wider">EVACUATION</span>
            <span className="font-bold text-gray-800 text-sm tracking-wider">PLAN SERVICE</span>
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8 text-gray-700 font-medium text-sm">
          <Link href="/" className="text-[#ff5722] font-semibold">Home</Link>
          <Link href="/service" className="hover:text-[#ff5722] transition">Service</Link>
          <Link href="/portfolio" className="hover:text-[#ff5722] transition">Portfolio</Link>
          <Link href="/blog" className="hover:text-[#ff5722] transition">Blog</Link>
          <Link href="/contact" className="hover:text-[#ff5722] transition">Contact</Link>
        </nav>

        {/* Contact Button */}
        <div className="hidden md:block">
          <Link 
            href="/contact" 
            className="bg-white border border-gray-200 text-[#ff5722] px-6 py-2 rounded-sm shadow-sm hover:shadow-md hover:bg-gray-50 transition duration-200 font-medium"
          >
            Contact Us
          </Link>
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
        <div className="md:hidden mt-4 bg-white p-4 rounded-lg shadow-lg flex flex-col space-y-4 items-center">
          <Link href="/" className="text-[#ff5722] font-semibold" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/service" className="hover:text-[#ff5722] transition" onClick={() => setIsMenuOpen(false)}>Service</Link>
          <Link href="/portfolio" className="hover:text-[#ff5722] transition" onClick={() => setIsMenuOpen(false)}>Portfolio</Link>
          <Link href="/blog" className="hover:text-[#ff5722] transition" onClick={() => setIsMenuOpen(false)}>Blog</Link>
          <Link href="/contact" className="hover:text-[#ff5722] transition" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          <Link 
            href="/contact" 
            className="w-full text-center bg-white border border-gray-200 text-[#ff5722] px-6 py-2 rounded-sm shadow-sm hover:shadow-md hover:bg-gray-50 transition duration-200 font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}