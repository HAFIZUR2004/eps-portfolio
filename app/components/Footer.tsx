import React from 'react';
import Link from 'next/link';
import { MessageSquare, Mail, Globe } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaGoogle, FaYoutube } from 'react-icons/fa';

export default function FooterSection() {
  return (
    <footer className="bg-white border-t border-gray-100 text-gray-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
        
        {/* Column 1: Brand Info & Socials */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-extrabold text-xl tracking-wider">EVACUATION</span>
            <span className="text-orange-500 font-bold text-xs border-l border-gray-300 pl-2 uppercase">PLAN SERVICE</span>
          </div>

          <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wide">
            Professional Fire Evacuation Plans
          </h3>

          <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
            We create accurate, code-compliant Fire Evacuation Plans for commercial, residential, and industrial buildings worldwide.
          </p>

          {/* Social Icons Container (Font Awesome Icons) */}
          <div className="bg-gray-50 p-2.5 rounded-xl inline-flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-sm hover:text-emerald-600 transition-colors">
              <FaFacebookF className="w-3.5 h-3.5" />
            </a>
            <a href="#" aria-label="Twitter" className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-sm hover:text-emerald-600 transition-colors">
              <FaTwitter className="w-3.5 h-3.5" />
            </a>
            <a href="#" aria-label="Instagram" className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-sm hover:text-emerald-600 transition-colors">
              <FaInstagram className="w-3.5 h-3.5" />
            </a>
            <a href="#" aria-label="Google" className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-sm hover:text-emerald-600 transition-colors">
              <FaGoogle className="w-3.5 h-3.5" />
            </a>
            <a href="#" aria-label="Youtube" className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-sm hover:text-emerald-600 transition-colors">
              <FaYoutube className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-xs text-gray-600 font-medium">
            <li><Link href="#" className="hover:text-emerald-600 transition-colors">Home</Link></li>
            <li><Link href="#" className="hover:text-emerald-600 transition-colors">Service</Link></li>
            <li><Link href="#" className="hover:text-emerald-600 transition-colors">Portfolio</Link></li>
            <li><Link href="#" className="hover:text-emerald-600 transition-colors">Blog</Link></li>
            <li><Link href="#" className="hover:text-emerald-600 transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Column 3: Service */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Service</h4>
          <ul className="space-y-2 text-xs text-gray-600 font-medium">
            <li><Link href="#" className="hover:text-emerald-600 transition-colors">Fire Evacuation Plan</Link></li>
            <li><Link href="#" className="hover:text-emerald-600 transition-colors">Fire Alarm Zone Plan</Link></li>
            <li><Link href="#" className="hover:text-emerald-600 transition-colors">Fire Zone Block Plan</Link></li>
            <li><Link href="#" className="hover:text-emerald-600 transition-colors">Fire Hydrant Block Plan</Link></li>
            <li><Link href="#" className="hover:text-emerald-600 transition-colors">Floor Plan Redesign</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Contact Us</h4>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-gray-900">Whatsapp Us</h5>
                <p className="text-[10px] text-gray-500">+880 XXX XXX XXXX</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-gray-900">Email Us</h5>
                <p className="text-[10px] text-gray-500">info@yourdomain.com</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-gray-900">Worldwide Remote Service</h5>
                <p className="text-[10px] text-gray-500">Serving clients across USA, Canada, UK, Australia & more</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}