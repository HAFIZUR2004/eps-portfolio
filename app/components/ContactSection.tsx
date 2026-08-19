"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { MessageSquare, Mail, Globe, Check, Send, Loader2, MessageCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// ==============================================
// 1. TypeScript Definitions (Fixes the 'never' type error)
// ==============================================
interface FormData {
  fullName: string;
  whatsapp: string;
  country: string;
  buildingType: string;
  message: string;
  services: string[];
  file: File | null;
}

// Data Lists
const servicesList: string[] = ["Fire Evacuation Plan", "Fire Exit Plan", "Fire Hydrant Block Plan", "Fire Safety Plan", "Fire Alarm Zone Plan", "Site Map Plan", "Fire Escape Plan", "Fire Zone Block Plan", "Floor Plan Redesign"];
const whyContactUsList: string[] = ["Fiverr marketplace Level 2 seller", "24-Hour Response", "15 years of experience", "Unlimited Revisions Until Approved", "After-Sales Support", "Worldwide Service"];

export default function ContactPage() {
  // ==============================================
  // 2. State with explicit Types
  // ==============================================
  const [form, setForm] = useState<FormData>({ 
    fullName: "", 
    whatsapp: "", 
    country: "", 
    buildingType: "", 
    message: "", 
    services: [], 
    file: null 
  });
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // ==============================================
  // 3. Handlers with exact Types (Fixes 'implicit any' errors)
  // ==============================================
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (service: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service) 
        ? prev.services.filter((s) => s !== service) 
        : [...prev.services, service],
    }));
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm((prev) => ({ ...prev, file: e.target.files![0] }));
      setFileName(e.target.files[0].name);
    }
  };

  // ==============================================
  // 4. Submit Logic with file conversion
  // ==============================================
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      let fileData = null;
      if (form.file) {
        // Fix for 'Argument of type null is not assignable to Blob'
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(form.file as Blob); // Type assertion
        });
        fileData = { name: form.file.name, base64 };
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, file: fileData }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Message sent successfully!");
        setForm({ fullName: "", whatsapp: "", country: "", buildingType: "", message: "", services: [], file: null });
        setFileName("");
        
        // Fix for 'Object is possibly null' & 'Property value does not exist'
        const fileInput = document.getElementById("floorPlanFile") as HTMLInputElement | null;
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        toast.error(data.error || "Something went wrong!");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* React Hot Toast Setup */}
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { borderRadius: "12px", background: "#fff", color: "#1f2937", padding: "14px 16px", boxShadow: "0 10px 30px rgba(0,0,0,0.10)" } }} />
      
      <main className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-10 flex items-center justify-center gap-4">
            <div className="relative h-8 w-8 shrink-0">
              <span className="absolute left-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
              <span className="absolute right-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">Contact</h2>
            <div className="relative h-8 w-8 shrink-0">
              <span className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full bg-[#006A4E]" />
              <span className="absolute right-0 top-0 h-7 w-7 rounded-full bg-[#FF3B1D]" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Let's Discuss Your Project</h2>
                <p className="text-sm text-gray-500 mt-1">Upload your floor plan and receive a customized quote within 24 hours.</p>
              </div>

              <div className="space-y-3">
                {[
                  { icon: <MessageSquare className="w-5 h-5" />, color: "bg-emerald-100 text-emerald-600", title: "WhatsApp Us", desc: "Available 24 hours", link: "https://wa.me/8801884369340" },
                  { icon: <Mail className="w-5 h-5" />, color: "bg-blue-100 text-blue-600", title: "Email Us", desc: "Fast Response Within 24 Hours", link: "mailto:your-email@example.com" },
                  { icon: <Globe className="w-5 h-5" />, color: "bg-teal-100 text-teal-600", title: "Worldwide Remote Service", desc: "Serving clients across USA, Canada, UK, Australia & more", link: null }
                ].map((item, i) => (
                  <a key={i} href={item.link || "#"} target={item.link ? "_blank" : ""} className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 ${item.link ? "hover:border-emerald-200" : ""} transition-all block`}>
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>{item.icon}</div>
                    <div><h3 className="text-sm font-bold text-gray-900">{item.title}</h3><p className="text-xs text-gray-500">{item.desc}</p></div>
                  </a>
                ))}
              </div>

              <div className="bg-white/80 p-5 rounded-2xl border border-emerald-100 shadow-sm max-w-sm">
                <h3 className="text-xs font-bold text-emerald-700 text-center mb-3">Why Contact Us?</h3>
                <ul className="space-y-2 text-xs text-gray-700 font-medium">
                  {whyContactUsList.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column (Form) */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-xs font-bold text-gray-800 mb-1">Full Name *</label><input name="fullName" type="text" value={form.fullName} onChange={handleChange} className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-gray-200 bg-gray-50/30" required /></div>
                <div><label className="block text-xs font-bold text-gray-800 mb-1">WhatsApp</label><input name="whatsapp" type="text" value={form.whatsapp} onChange={handleChange} placeholder="WhatsApp number with country code" className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-gray-200 bg-gray-50/30" /></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-gray-800 mb-1">Country</label><select name="country" value={form.country} onChange={handleChange} className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-gray-200 bg-gray-50/30"><option value="">Select Country</option><option value="US">United States</option><option value="UK">United Kingdom</option><option value="CA">Canada</option><option value="AU">Australia</option><option value="DE">Germany</option><option value="IN">India</option></select></div>
                  <div><label className="block text-xs font-bold text-gray-800 mb-1">Building Type</label><select name="buildingType" value={form.buildingType} onChange={handleChange} className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-gray-200 bg-gray-50/30"><option value="">Select Building Type</option><option value="residential">Residential</option><option value="commercial">Commercial</option><option value="industrial">Industrial</option><option value="hospital">Hospital</option></select></div>
                </div>

                <div><label className="block text-xs font-bold text-gray-800 mb-1">Message *</label><textarea name="message" rows={3} value={form.message} onChange={handleChange} placeholder="Mark the locations of fire extinguishers, fire alarm, etc." className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-gray-200 bg-gray-50/30 resize-none" required /></div>
                
                <div><label className="block text-xs font-bold text-gray-800 mb-2">Select Required Service(s)</label><div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-gray-600">{servicesList.map((s, i) => (<label key={i} className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={form.services.includes(s)} onChange={() => handleCheckbox(s)} className="rounded border-gray-300 text-emerald-600 w-3.5 h-3.5" /><span>{s}</span></label>))}</div></div>

                <div><label className="block text-xs font-bold text-gray-800 mb-1">Upload Floor Plan (PDF, DWG, JPG, PNG)</label><div className="flex items-center gap-3"><label htmlFor="floorPlanFile" className="cursor-pointer bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs px-4 py-2 rounded-lg">Choose File<input id="floorPlanFile" type="file" accept=".pdf,.dwg,.jpg,.jpeg,.png" onChange={handleFile} className="hidden" /></label>{fileName && <span className="text-xs text-gray-600 truncate max-w-xs">{fileName}</span>}</div></div>

                <p className="text-[10px] text-gray-400 text-center">Your information is secure and will never be shared with third parties.</p>
                <button disabled={loading} className="w-full bg-[#006A4E] hover:bg-[#00523d] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50">
                  {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</> : <>Send Quote Request <Send className="w-3.5 h-3.5" /></>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Floating WhatsApp Button using Lucide MessageCircle */}
      <a href="https://wa.me/8801884369340" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all">
        <MessageCircle className="w-7 h-7" />
      </a>
    </>
  );
}