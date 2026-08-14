"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { MessageSquare, Mail, Globe, Check, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  // 📌 ফাইলকে Base64 তে রূপান্তরের ফাংশন
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // 📌 ফর্ম সাবমিট হ্যান্ডলার (Base64 + JSON)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      let fileData = null;

      // যদি ফাইল থাকে, তাহলে Base64 তে রূপান্তর করুন
      if (formData.file) {
        const base64String = await convertFileToBase64(formData.file);
        fileData = {
          name: formData.file.name,
          base64: base64String,
        };
      }

      // API তে JSON ডেটা পাঠান (Base64 সহ)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          whatsapp: formData.whatsapp,
          country: formData.country,
          buildingType: formData.buildingType,
          message: formData.message,
          services: formData.services,
          file: fileData, // ✅ Base64 ফাইল ডেটা
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message || "Your message has been sent successfully!" });
        // রিসেট ফর্ম
        setFormData({
          fullName: '',
          whatsapp: '',
          country: '',
          buildingType: '',
          message: '',
          services: [],
          file: null,
        });
        setFileName('');
      } else {
        setMessage({ type: "error", text: data.error || "Failed to send message. Please try again." });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header */}
        <div className="mb-10 flex items-center justify-center gap-4">
          {/* Left Decoration */}
          <div className="relative h-8 w-8 shrink-0">
            <span className="absolute left-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
            <span className="absolute right-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
          </div>

          {/* Heading */}
          <h2 className="whitespace-nowrap text-3xl font-bold tracking-tight text-black md:text-4xl">
            Contact
          </h2>

          {/* Right Decoration */}
          <div className="relative h-8 w-8 shrink-0">
            <span className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
            <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div className="max-w-2xl mx-auto mb-6">
            <div
              className={`p-4 rounded-xl flex items-center gap-3 text-xs font-medium border ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

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
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || 'YOUR_PHONE_NUMBER'}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-emerald-200 transition-all block"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">WhatsApp Us</h3>
                  <p className="text-xs text-gray-500">Available 24 hours</p>
                </div>
              </a>

              {/* Email Link */}
              <a 
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'your-email@example.com'}`}
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
                  Full Name *
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
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                    <option value="IN">India</option>
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
                    <option value="hospital">Hospital</option>
                    <option value="school">School</option>
                    <option value="hotel">Hotel</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-xs font-bold text-gray-800 mb-1">
                  Message *
                </label>
                <textarea 
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Mark the locations of fire extinguishers, fire alarm, smoke detectors, First aid kit, emergency exits, and assembly point, etc." 
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/30 resize-none placeholder:text-gray-400 text-gray-900"
                  required
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
                disabled={isSubmitting}
                className="w-full bg-[#006A4E] hover:bg-[#00523d] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Quote Request
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      </div>
    </main>
  );
}