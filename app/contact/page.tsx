"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { MessageSquare, Mail, Globe, Check, Send } from 'lucide-react';

// Form Data Interface for TypeScript
interface FormDataState {
  fullName: string;
  whatsapp: string;
  country: string;
  buildingType: string;
  message: string;
  services: string[];
  file: File | null;
}

const servicesList: string[] = [
  "Fire Evacuation Plan",
  "Fire Exit Plan",
  "Fire Hydrant Block Plan",
  "Fire Safety Plan",
  "Fire Alarm Zone Plan",
  "Site Map Plan",
  "Fire Escape Plan",
  "Fire Zone Block Plan",
  "Floor Plan Redesign",
];

const whyContactUsList: string[] = [
  "Fiverr marketplace Level 2 seller",
  "24-Hour Response",
  "15 years of experience",
  "Unlimited Revisions Until Approved",
  "After-Sales Support",
  "Worldwide Service",
];

export default function ContactPage() {
  const [formData, setFormData] = useState<FormDataState>({
    fullName: '',
    whatsapp: '',
    country: '',
    buildingType: '',
    message: '',
    services: [],
    file: null,
  });

  const [fileName, setFileName] = useState<string>('');

  // Handle Input Changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Checkbox Selection
  const handleCheckboxChange = (service: string) => {
    setFormData((prev) => {
      const isSelected = prev.services.includes(service);
      return {
        ...prev,
        services: isSelected
          ? prev.services.filter((item) => item !== service)
          : [...prev.services, service],
      };
    });
  };

  // Handle File Upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFormData((prev) => ({ ...prev, file: selectedFile }));
      setFileName(selectedFile.name);
    }
  };

  // Form Submit Handler
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // API Call বা Server Actions এখানে হ্যান্ডেল করুন
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Contact Us
          </h1>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Side: Info & Why Contact Us */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                Let's Discuss Your Project
              </h2>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                Upload your floor plan and project details and receive a customized quote within 24 hours.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-3">
              {/* WhatsApp Link */}
              <a 
                href="https://wa.me/YOUR_PHONE_NUMBER" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-emerald-200 transition-all block"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Whatsapp Us</h3>
                  <p className="text-xs text-gray-500">Available 24 hours</p>
                </div>
              </a>

              {/* Email Link */}
              <a 
                href="mailto:your-email@example.com"
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-all block"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Email Us</h3>
                  <p className="text-xs text-gray-500">Fast Response Within 24 Hours</p>
                </div>
              </a>

              {/* Worldwide Location Info */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Worldwide Remote Service</h3>
                  <p className="text-xs text-gray-500">Serving clients across USA, Canada, UK, Australia & more</p>
                </div>
              </div>
            </div>

            {/* Why Contact Us Box */}
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-emerald-100 shadow-sm max-w-sm mx-auto lg:mx-0">
              <h3 className="text-xs font-bold text-emerald-700 text-center mb-3">
                Why Contact Us?
              </h3>
              <ul className="space-y-2 text-xs text-gray-700 font-medium">
                {whyContactUsList.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
            <form className="space-y-4" onSubmit={handleSubmit}>
              
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-bold text-gray-800 mb-1">
                  Full Name
                </label>
                <input 
                  id="fullName"
                  name="fullName"
                  type="text" 
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your name" 
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/30 text-gray-900"
                  required
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label htmlFor="whatsapp" className="block text-xs font-bold text-gray-800 mb-1">
                  WhatsApp
                </label>
                <input 
                  id="whatsapp"
                  name="whatsapp"
                  type="text" 
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="WhatsApp number with country code" 
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/30 text-gray-900"
                />
              </div>

              {/* Country & Building Type Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-xs font-bold text-gray-800 mb-1">
                    Country
                  </label>
                  <select 
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/30"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="buildingType" className="block text-xs font-bold text-gray-800 mb-1">
                    Building Type
                  </label>
                  <select 
                    id="buildingType"
                    name="buildingType"
                    value={formData.buildingType}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/30"
                  >
                    <option value="">Select Building Type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-xs font-bold text-gray-800 mb-1">
                  Message
                </label>
                <textarea 
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Mark the locations of fire extinguishers, fire alarm, smoke detectors, First aid kit, emergency exits, and assembly point, etc." 
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/30 resize-none placeholder:text-gray-400 text-gray-900"
                ></textarea>
              </div>

              {/* Select Required Service Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  Select Required Service(s)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-gray-600">
                  {servicesList.map((service: string, idx: number) => (
                    <label key={idx} className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={formData.services.includes(service)}
                        onChange={() => handleCheckboxChange(service)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5" 
                      />
                      <span>{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Upload Floor Plan (PDF, DWG, JPG, PNG)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs px-4 py-2 rounded-lg transition-colors inline-block">
                    Choose File
                    <input 
                      type="file" 
                      accept=".pdf,.dwg,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                  </label>
                  {fileName && (
                    <span className="text-xs text-gray-600 truncate max-w-xs">{fileName}</span>
                  )}
                </div>
              </div>

              {/* Privacy Disclaimer */}
              <p className="text-[10px] text-gray-400 text-center">
                Your information is secure and will never be shared with third parties.
              </p>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full bg-[#006A4E] hover:bg-[#00523d] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                Send Quote Request
                <Send className="w-3.5 h-3.5" />
              </button>

            </form>
          </div>

        </div>
      </div>
    </main>
  );
}