"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Loader2, PackagePlus, HelpCircle, ImagePlus, X, Pencil, Eye, RefreshCw, Star, Package } from "lucide-react";
import { CldUploadButton, CloudinaryUploadWidgetResults } from "next-cloudinary";

/* ========== TYPES ========== */
interface FAQ { question: string; answer: string; }
interface PackageData { price?: string; title?: string; desc?: string; delivery?: string; }
interface Service {
  _id: string; title: string; rating?: string; reviewsCount?: string;
  mainImage?: string; galleryImages?: string[]; recentWorks?: string[];
  aboutGig?: string; whyWorkWithMe?: string;
  basicPackage?: PackageData; standardPackage?: PackageData; premiumPackage?: PackageData;
  sellerName?: string; sellerRole?: string; sellerImage?: string; sellerBio?: string;
  faqs?: FAQ[]; createdAt?: string; updatedAt?: string;
}
interface FormData {
  title: string; rating: string; reviewsCount: string;
  mainImage: string; gigGalleryImages: string[]; recentWorks: string[];
  aboutGig: string; whyWorkWithMe: string;
  packages: { basic: PackageData; standard: PackageData; premium: PackageData };
  sellerName: string; sellerRole: string; sellerImage: string; sellerBio: string;
  faqs: FAQ[];
}

/* ========== CONSTANTS ========== */
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "eps_preset";

/* ========== INITIAL STATE ========== */
const initialFormData: FormData = {
  title: "", rating: "5.0", reviewsCount: "40",
  mainImage: "", gigGalleryImages: [""], recentWorks: [""],
  aboutGig: "", whyWorkWithMe: "",
  packages: {
    basic: { price: "10", title: "Small Building Evacuation Plan", desc: "Single Floor • Up to 1,000 sq. ft.", delivery: "1 Day Delivery" },
    standard: { price: "25", title: "Medium Building Evacuation Plan", desc: "Up to 2 Floors • Up to 2,500 sq. ft.", delivery: "2 Day Delivery" },
    premium: { price: "50", title: "Large Complex Evacuation Plan", desc: "Multi-story / Large Factory", delivery: "3 Day Delivery" },
  },
  sellerName: "Sabbir Hossain", sellerRole: "Service provider", sellerImage: "", sellerBio: "",
  faqs: [{ question: "Do you offer assistance after completion?", answer: "Yes, we provide post-delivery assistance." }],
};

/* ========== REUSABLE COMPONENTS ========== */
const PackageCard = ({ label, color, data, onChange }: { label: string; color: string; data: PackageData; onChange: (key: string, value: string) => void }) => (
  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
    <h3 className={`text-sm font-bold ${color}`}>{label}</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <input type="text" placeholder="Price" value={data.price || ""} onChange={(e) => onChange("price", e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs" />
      <input type="text" placeholder="Title" value={data.title || ""} onChange={(e) => onChange("title", e.target.value)} className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs" />
    </div>
    <textarea placeholder="Description" value={data.desc || ""} onChange={(e) => onChange("desc", e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs min-h-20" />
    <input type="text" placeholder="Delivery" value={data.delivery || ""} onChange={(e) => onChange("delivery", e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs" />
  </div>
);

const ImageInput = ({ label, value, onValueChange, onUpload, onRemove }: { 
  label: string; 
  value: string; 
  onValueChange: (v: string) => void; 
  onUpload: (r: CloudinaryUploadWidgetResults) => void; 
  onRemove?: () => void;
}) => (
  <div>
    <label className="block text-xs text-slate-300 mb-2">{label}</label>
    <div className="flex flex-col md:flex-row gap-3">
      <input type="text" value={value} onChange={(e) => onValueChange(e.target.value)} placeholder="Image URL..." className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500" />
      <CldUploadButton uploadPreset={uploadPreset} onSuccess={onUpload} className="bg-emerald-600 hover:bg-emerald-700 px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-2">
        <ImagePlus className="w-4 h-4" /> Upload
      </CldUploadButton>
    </div>
    {value && (
      <div className="relative w-40 h-24 mt-3 rounded-xl overflow-hidden border border-slate-700">
        <Image src={value} alt={label} fill className="object-cover" sizes="160px" />
        {onRemove && <button type="button" onClick={onRemove} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-1.5 rounded-full"><X className="w-3 h-3" /></button>}
      </div>
    )}
  </div>
);

/* ========== MAIN COMPONENT ========== */
export default function ServiceManagementPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [services, setServices] = useState<Service[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getCloudinaryUrl = (result: CloudinaryUploadWidgetResults): string | null => {
    if (!result?.info || typeof result.info === "string") return null;
    return "secure_url" in result.info ? result.info.secure_url || null : null;
  };

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/services", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) setServices(data.services || []);
      else alert(data.message || "Failed to load services");
    } catch (error) {
      console.error("FETCH SERVICES ERROR:", error);
      alert("Failed to load services");
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  /* Generic update helpers */
  const updateField = (key: keyof FormData, value: any) => setFormData(prev => ({ ...prev, [key]: value }));
  const updatePackage = (type: "basic" | "standard" | "premium", field: string, value: string) => {
    setFormData(prev => ({ ...prev, packages: { ...prev.packages, [type]: { ...prev.packages[type], [field]: value } } }));
  };
  const updateArrayItem = (key: "gigGalleryImages" | "recentWorks", index: number, value: string) => {
    setFormData(prev => {
      const arr = [...prev[key]]; arr[index] = value;
      return { ...prev, [key]: arr };
    });
  };
  const addArrayItem = (key: "gigGalleryImages" | "recentWorks") => {
    setFormData(prev => ({ ...prev, [key]: [...prev[key], ""] }));
  };
  const removeArrayItem = (key: "gigGalleryImages" | "recentWorks", index: number) => {
    setFormData(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  };
  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    setFormData(prev => {
      const faqs = [...prev.faqs]; faqs[index] = { ...faqs[index], [field]: value };
      return { ...prev, faqs };
    });
  };
  const addFaq = () => setFormData(prev => ({ ...prev, faqs: [...prev.faqs, { question: "", answer: "" }] }));
  const removeFaq = (index: number) => setFormData(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));

  const resetForm = () => {
    setFormData({ ...initialFormData, gigGalleryImages: [""], recentWorks: [""], faqs: [{ question: "Do you offer assistance after completion?", answer: "Yes, we provide post-delivery assistance." }] });
    setEditingId(null);
  };

  const handleEdit = (service: Service) => {
    setEditingId(service._id);
    setFormData({
      title: service.title || "", rating: service.rating || "5.0", reviewsCount: service.reviewsCount || "0",
      mainImage: service.mainImage || "", gigGalleryImages: service.galleryImages?.length ? service.galleryImages : [""],
      recentWorks: service.recentWorks?.length ? service.recentWorks : [""],
      aboutGig: service.aboutGig || "", whyWorkWithMe: service.whyWorkWithMe || "",
      packages: {
        basic: service.basicPackage || {}, standard: service.standardPackage || {}, premium: service.premiumPackage || {},
      },
      sellerName: service.sellerName || "", sellerRole: service.sellerRole || "", sellerImage: service.sellerImage || "", sellerBio: service.sellerBio || "",
      faqs: service.faqs?.length ? service.faqs.map(f => ({ question: f.question || "", answer: f.answer || "" })) : [{ question: "", answer: "" }],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setServices(prev => prev.filter(s => s._id !== id));
        if (editingId === id) resetForm();
        alert("Service deleted successfully!");
      } else alert(data.message || "Failed to delete service");
    } catch (error) {
      console.error("DELETE SERVICE ERROR:", error);
      alert("Something went wrong while deleting.");
    } finally { setDeletingId(null); }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.mainImage.trim() || !formData.aboutGig.trim()) {
      alert("Please fill all required fields (Title, Main Image, About).");
      return;
    }
    try {
      setIsSubmitting(true);
      const url = editingId ? `/api/services/${editingId}` : "/api/services";
      const method = editingId ? "PUT" : "POST";
      const payload = {
        ...formData,
        galleryImages: formData.gigGalleryImages.filter(i => i.trim() !== ""),
        recentWorks: formData.recentWorks.filter(i => i.trim() !== ""),
        faqs: formData.faqs.filter(f => f.question.trim() !== "" || f.answer.trim() !== ""),
      };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok || !data.success) { alert(data.message || "Failed to save service."); return; }
      alert(editingId ? "Service updated successfully!" : "Service created successfully!");
      resetForm(); await fetchServices();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("SAVE SERVICE ERROR:", error);
      alert("Something went wrong.");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <PackagePlus className="w-7 h-7 text-emerald-500" />
              {editingId ? "Update Service" : "Service Management"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">Create, update and manage all your services.</p>
          </div>
          {editingId && (
            <button type="button" onClick={resetForm} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm transition">
              <X className="w-4 h-4" /> Cancel Edit
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-3 mb-5">1. Basic Information</h2>
            <div className="space-y-4">
              <input type="text" value={formData.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Gig Title *" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500" required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={formData.rating} onChange={(e) => updateField("rating", e.target.value)} placeholder="Rating" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500" />
                <input type="text" value={formData.reviewsCount} onChange={(e) => updateField("reviewsCount", e.target.value)} placeholder="Reviews Count" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500" />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-800 pb-3">
              <h2 className="text-lg font-semibold text-white">2. Media & Gallery</h2>
              <button type="button" onClick={() => addArrayItem("gigGalleryImages")} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"><Plus className="w-4 h-4" /> Add Gallery Image</button>
            </div>

            <ImageInput label="Main Cover Image *" value={formData.mainImage} onValueChange={(v) => updateField("mainImage", v)} onUpload={(r) => { const url = getCloudinaryUrl(r); if (url) updateField("mainImage", url); }} onRemove={() => updateField("mainImage", "")} />

            <div className="border-t border-slate-800 pt-5">
              <label className="block text-xs text-slate-300 mb-3">Gig Gallery Images</label>
              <div className="space-y-3">
                {formData.gigGalleryImages.map((img, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-2">
                    <input type="text" value={img} onChange={(e) => updateArrayItem("gigGalleryImages", idx, e.target.value)} placeholder={`Gallery Image ${idx + 1} URL`} className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-emerald-500" />
                    <CldUploadButton uploadPreset={uploadPreset} onSuccess={(r) => { const url = getCloudinaryUrl(r); if (url) updateArrayItem("gigGalleryImages", idx, url); }} className="bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1"><ImagePlus className="w-3.5 h-3.5" /> Upload</CldUploadButton>
                    {formData.gigGalleryImages.length > 1 && <button type="button" onClick={() => removeArrayItem("gigGalleryImages", idx)} className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs text-slate-300">Recent Project Images</label>
                <button type="button" onClick={() => addArrayItem("recentWorks")} className="text-xs text-emerald-400 flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add Image</button>
              </div>
              <div className="space-y-3">
                {formData.recentWorks.map((img, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-2">
                    <input type="text" value={img} onChange={(e) => updateArrayItem("recentWorks", idx, e.target.value)} placeholder={`Recent Work ${idx + 1} URL`} className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-emerald-500" />
                    <CldUploadButton uploadPreset={uploadPreset} onSuccess={(r) => { const url = getCloudinaryUrl(r); if (url) updateArrayItem("recentWorks", idx, url); }} className="bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1"><ImagePlus className="w-3.5 h-3.5" /> Upload</CldUploadButton>
                    {formData.recentWorks.length > 1 && <button type="button" onClick={() => removeArrayItem("recentWorks", idx)} className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Packages */}
          <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl space-y-5">
            <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-3">3. Packages Setup</h2>
            <PackageCard label="Basic Package" color="text-emerald-400" data={formData.packages.basic} onChange={(f, v) => updatePackage("basic", f, v)} />
            <PackageCard label="Standard Package" color="text-amber-400" data={formData.packages.standard} onChange={(f, v) => updatePackage("standard", f, v)} />
            <PackageCard label="Premium Package" color="text-purple-400" data={formData.packages.premium} onChange={(f, v) => updatePackage("premium", f, v)} />
          </div>

          {/* Details & FAQs */}
          <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl space-y-5">
            <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-3">4. Details & FAQs</h2>
            <textarea rows={6} value={formData.aboutGig} onChange={(e) => updateField("aboutGig", e.target.value)} placeholder="About this Gig *" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500" required />
            <textarea rows={4} value={formData.whyWorkWithMe} onChange={(e) => updateField("whyWorkWithMe", e.target.value)} placeholder="Why Work With Me" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500" />

            <div className="border-t border-slate-800 pt-5">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium flex items-center gap-2"><HelpCircle className="w-4 h-4 text-emerald-400" /> FAQs</label>
                <button type="button" onClick={addFaq} className="text-xs text-emerald-400 flex items-center gap-1"><Plus className="w-4 h-4" /> Add FAQ</button>
              </div>
              <div className="space-y-3">
                {formData.faqs.map((faq, idx) => (
                  <div key={idx} className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <input type="text" value={faq.question} onChange={(e) => updateFaq(idx, "question", e.target.value)} placeholder="Question..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs" />
                    <textarea value={faq.answer} onChange={(e) => updateFaq(idx, "answer", e.target.value)} placeholder="Answer..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs min-h-20" />
                    {formData.faqs.length > 1 && <button type="button" onClick={() => removeFaq(idx)} className="absolute top-3 right-3 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seller */}
          <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-2xl space-y-5">
            <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-3">5. Seller Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" value={formData.sellerName} onChange={(e) => updateField("sellerName", e.target.value)} placeholder="Seller Name" className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs" />
              <input type="text" value={formData.sellerRole} onChange={(e) => updateField("sellerRole", e.target.value)} placeholder="Seller Role" className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs" />
            </div>
            <ImageInput label="Seller Image" value={formData.sellerImage} onValueChange={(v) => updateField("sellerImage", v)} onUpload={(r) => { const url = getCloudinaryUrl(r); if (url) updateField("sellerImage", url); }} onRemove={() => updateField("sellerImage", "")} />
            <textarea rows={4} value={formData.sellerBio} onChange={(e) => updateField("sellerBio", e.target.value)} placeholder="Seller Bio" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs" />
          </div>

          {/* Submit */}
          <div className="flex flex-col md:flex-row justify-end gap-3">
            {editingId && <button type="button" onClick={resetForm} className="px-7 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm">Cancel</button>}
            <button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-8 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> {editingId ? "Updating..." : "Publishing..."}</> : <>{editingId ? <><RefreshCw className="w-4 h-4" /> Update Service</> : <><Plus className="w-4 h-4" /> Publish Service</>}</>}
            </button>
          </div>
        </form>

        {/* Service List */}
        <section className="pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-bold text-white">Your Services</h2>
              <p className="text-xs text-slate-400 mt-1">{services.length} service{services.length !== 1 ? "s" : ""} available</p>
            </div>
            <button type="button" onClick={fetchServices} className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl text-xs"><RefreshCw className="w-4 h-4" /> Refresh</button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl">
              <Package className="w-10 h-10 mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400">No services found.</p>
              <p className="text-xs text-slate-600 mt-1">Create your first service above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {services.map((service) => (
                <div key={service._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition">
                  <div className="relative aspect-video bg-slate-950">
                    {service.mainImage ? <Image src={service.mainImage} alt={service.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" /> : <div className="flex items-center justify-center h-full text-slate-600">No Image</div>}
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-xs flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {service.rating || "5.0"}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white line-clamp-2 min-h-10">{service.title}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-slate-400">{service.reviewsCount || "0"} reviews</span>
                      <span className="text-emerald-400 font-semibold text-sm">${service.basicPackage?.price || "0"}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span>{service.galleryImages?.length || 0} gallery</span>
                      <span>{service.recentWorks?.length || 0} projects</span>
                      <span>{service.faqs?.length || 0} FAQs</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button type="button" onClick={() => handleEdit(service)} className="flex items-center justify-center gap-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-600/20 px-3 py-2.5 rounded-xl text-xs font-medium transition"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                      <button type="button" disabled={deletingId === service._id} onClick={() => handleDelete(service._id)} className="flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/20 px-3 py-2.5 rounded-xl text-xs font-medium transition disabled:opacity-50">
                        {deletingId === service._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete
                      </button>
                    </div>
                    <button type="button" onClick={() => window.open(`/services/${service._id}`, "_blank")} className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2.5 rounded-xl text-xs transition"><Eye className="w-3.5 h-3.5" /> View Service</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}