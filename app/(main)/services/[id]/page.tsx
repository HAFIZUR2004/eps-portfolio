"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";

interface PackageDetail {
  price?: string;
  delivery?: string;
  revisions?: string;
  coverage?: string;
  title?: string;
  desc?: string;
}

interface ServiceData {
  _id: string;
  title?: string;
  rating?: string | number;
  reviewsCount?: string | number;
  mainImage?: string;
  images?: string[];
  aboutGig?: string;
  whyWorkWithMe?: string;
  sellerName?: string;
  sellerBio?: string;
  sellerImage?: string;
  basicPackage?: PackageDetail;
  standardPackage?: PackageDetail;
  premiumPackage?: PackageDetail;
  faqs?: {
    question: string;
    answer: string;
  }[];
  category?: string;
}

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.id;

  // ============================================================
  // STATES
  // ============================================================

  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ Other Services (যেগুলো ইমেজ হিসেবে দেখাবে)
  const [otherServices, setOtherServices] = useState<ServiceData[]>([]);
  const [loadingOther, setLoadingOther] = useState<boolean>(true);

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<"basic" | "standard" | "premium">("basic");
  const [quantity, setQuantity] = useState<string>("1");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isBioExpanded, setIsBioExpanded] = useState<boolean>(false);

  // ============================================================
  // FETCH SERVICE DETAILS
  // ============================================================

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/services/${serviceId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch service details");
        }

        const data = await res.json();

        if (data?.success && data?.service) {
          setService(data.service);
          setSelectedImage(
            data.service.mainImage ||
              data.service.images?.[0] ||
              "/placeholder.jpg"
          );
        } else {
          setError("Service details not found.");
        }
      } catch (err: unknown) {
        console.error("Error fetching detail:", err);
        setError("Unable to load service details right now.");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchServiceDetail();
    }
  }, [serviceId]);

  // ============================================================
  // ✅ FETCH OTHER SERVICES (শুধু ইমেজ দেখানোর জন্য)
  // ============================================================

  useEffect(() => {
    const fetchOtherServices = async () => {
      if (!serviceId) return;
      try {
        setLoadingOther(true);
        const res = await fetch("/api/services", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        if (data?.success && Array.isArray(data.services)) {
          // বর্তমান সার্ভিস বাদ দিয়ে অন্য ৪টি সার্ভিস নিবে
          const others = data.services
            .filter((s: ServiceData) => s._id !== serviceId)
            .slice(0, 4);
          setOtherServices(others);
        }
      } catch (error) {
        console.error("Error fetching other services:", error);
      } finally {
        setLoadingOther(false);
      }
    };
    fetchOtherServices();
  }, [serviceId]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#F8F6F2]">
        <Loader2 className="h-8 w-8 animate-spin text-[#006A4E]" />
        <p className="text-sm font-medium text-gray-600">Loading details...</p>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F6F2] p-4 text-center">
        <h2 className="mb-2 text-xl font-bold text-gray-800">
          {error || "Service Not Found"}
        </h2>
        <Link
          href="/services"
          className="rounded-xl bg-[#006A4E] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#075631]"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  // ============================================================
  // GALLERY
  // ============================================================

  const galleryImages =
    service.images && service.images.length > 0
      ? service.images
      : [service.mainImage || "/placeholder.jpg"];

  // ============================================================
  // PACKAGES
  // ============================================================

  const packagesInfo = {
    basic: {
      price: service.basicPackage?.price ? `$${service.basicPackage.price}` : "$10",
      title: service.basicPackage?.title || "Small Building Evacuation Plan",
      desc: service.basicPackage?.desc || "Single Floor • Up to 1,000 sq. ft.",
      delivery: service.basicPackage?.delivery || "1 Day Delivery",
      revisions: service.basicPackage?.revisions || "Unlimited Revisions",
      coverage: service.basicPackage?.coverage || "1,000 sq. ft.",
    },
    standard: {
      price: service.standardPackage?.price ? `$${service.standardPackage.price}` : "$25",
      title: service.standardPackage?.title || "Medium Building Evacuation Plan",
      desc: service.standardPackage?.desc || "Up to 2 Floors • Up to 2,500 sq. ft.",
      delivery: service.standardPackage?.delivery || "2 Day Delivery",
      revisions: service.standardPackage?.revisions || "Unlimited Revisions",
      coverage: service.standardPackage?.coverage || "2,500 sq. ft.",
    },
    premium: {
      price: service.premiumPackage?.price ? `$${service.premiumPackage.price}` : "$50",
      title: service.premiumPackage?.title || "Large Complex Evacuation Plan",
      desc: service.premiumPackage?.desc || "Multi-story / Large Factory • Up to 5,000 sq. ft.",
      delivery: service.premiumPackage?.delivery || "3 Day Delivery",
      revisions: service.premiumPackage?.revisions || "Unlimited Revisions",
      coverage: service.premiumPackage?.coverage || "5,000 sq. ft.",
    },
  };

  // ============================================================
  // FAQ
  // ============================================================

  const faqs =
    service.faqs && service.faqs.length > 0
      ? service.faqs
      : [
          {
            question: "Do you offer assistance after the order has been completed?",
            answer: "Yes, we provide post-delivery assistance for minor updates and revisions.",
          },
          {
            question: "Can I choose my favorite Product category or Niche?",
            answer: "Absolutely! You can provide specific instructions, colors, or safety guidelines.",
          },
          {
            question: "Can I add products myself?",
            answer: "Yes, you can request custom modifications anytime.",
          },
          {
            question: "Are there any additional or hidden charges?",
            answer: "No, the price you see is the final price unless you require a completely new floor plan design from scratch.",
          },
        ];

  // ============================================================
  // WHY WORK WITH ME
  // ============================================================

  const whyWorkItems = [
    "Flexibility and Customization",
    "Expertise and Specialization",
    "Direct Communication",
  ];

  // ============================================================
  // ABOUT ME TEXT
  // ============================================================

  const defaultBio =
    "I am a professional graphic designer & artisan, with over 15 years of experience in fire safety plans and site diagrams.";
  const bioText = service.sellerBio || defaultBio;
  const bioLimit = 120;
  const isBioLong = bioText.length > bioLimit;
  const displayedBio = isBioExpanded || !isBioLong ? bioText : `${bioText.slice(0, bioLimit)}...`;

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-[#F8F6F2] pb-20 text-gray-800">
      {/* ========================================================
          PAGE HEADER
      ========================================================= */}
      <div className="border-b border-gray-200/80 bg-[#EFECE6] px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 flex items-center gap-1 text-xs text-gray-500">
            <Link href="/services" className="transition hover:text-[#006A4E] hover:underline">
              Services
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span>Detail</span>
          </p>
          <h1 className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl md:text-3xl">
            {service.title ||
              "We will design professional fire emergency evacuation plan, exit plan and safety plan."}
          </h1>
          <div className="mt-2 flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold text-gray-900">{service.rating ?? "5.0"}</span>
            <span className="text-xs text-gray-500">({service.reviewsCount ?? 0} Reviews)</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          MAIN CONTENT
      ========================================================= */}
      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {/* ======================================================
            LEFT CONTENT
        ======================================================= */}
        <div className="space-y-8 lg:col-span-2">
          {/* MAIN IMAGE */}
          <div className="relative h-[320px] w-full overflow-hidden rounded-xl border border-gray-300 bg-gray-200 shadow-sm sm:h-[400px] md:h-[450px]">
            <Image
              src={selectedImage || "/placeholder.jpg"}
              alt={service.title || "Service Preview"}
              fill
              priority
              className="object-contain md:object-cover"
              sizes="(max-width: 1200px) 100vw, 66vw"
            />
          </div>

          {/* GALLERY THUMBNAILS */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-14 w-24 flex-shrink-0 overflow-hidden rounded border-2 bg-white transition-all md:h-16 md:w-28 ${
                    selectedImage === img ? "border-[#096b43]" : "border-gray-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* ABOUT THIS GIG */}
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-[17px] font-bold text-gray-900">About this Gig</h2>
            <p className="whitespace-pre-line text-[14px] leading-relaxed text-gray-700">
              {service.aboutGig ||
                "Professional emergency evacuation planning tailored to your exact floor plans and local compliance guidelines."}
            </p>
          </div>

          {/* WHY WORK WITH ME */}
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-[17px] font-bold text-gray-900">Why Work With Me</h2>
            <p className="mb-2 text-[14px] leading-relaxed text-gray-700">
              {service.whyWorkWithMe ||
                "Experienced CAD designer specializing in fire safety, site plans, and evacuation mapping."}
            </p>
            <ul className="space-y-1.5 text-[14px] text-gray-700">
              {whyWorkItems.map((item, index) => (
                <li key={index} className="flex items-center gap-2.5">
                  <span className="rounded-full bg-[#096b43] p-0.5 text-white">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-[17px] font-bold text-gray-900">FAQ</h2>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div key={index} className="overflow-hidden rounded-lg border border-gray-100 bg-[#fafafa]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex w-full items-center justify-between p-3.5 text-left text-[14px] font-medium text-gray-800 transition-colors hover:text-[#096b43]"
                  >
                    <span>{faq.question}</span>
                    <span className="text-lg text-gray-400">{openFaq === index ? "−" : "+"}</span>
                  </button>
                  {openFaq === index && (
                    <p className="border-t border-gray-100 bg-white px-3.5 pb-3.5 pt-1 text-[13px] leading-relaxed text-gray-600">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ====================================================
              ✅ RECENT PROJECTS (শুধু ইমেজ দেখাবে)
          ===================================================== */}
          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-gray-900">Recent Projects</h2>
              <Link href="/services" className="text-xs font-semibold text-[#006A4E] hover:underline">
                View All
              </Link>
            </div>

            {loadingOther ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#006A4E]" />
              </div>
            ) : otherServices.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {otherServices.map((item) => (
                  <Link
                    key={item._id}
                    href={`/services/${item._id}`}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-200 transition hover:border-[#096b43] hover:shadow-md"
                  >
                    <Image
                      src={item.mainImage || "/placeholder.jpg"}
                      alt={item.title || "Project"}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
                <p className="text-sm text-gray-500">No projects available.</p>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================
            RIGHT SIDEBAR
        ======================================================= */}
        <div className="space-y-6">
          {/* PACKAGE CARD */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="bg-[#096b43] py-4 text-center text-white">
              <div className="mb-0.5 text-sm font-light">Price</div>
              <div className="text-3xl font-bold">{packagesInfo[selectedPackage].price}</div>
            </div>
            <div className="border-b border-gray-200 p-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Quantity</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white p-2 text-sm focus:border-[#096b43] focus:outline-none"
              >
                <option value="1">1 Evacuation plan</option>
                <option value="2">2 Evacuation plans</option>
                <option value="3">3 Evacuation plans</option>
              </select>
            </div>
            <div className="p-5">
              <h3 className="mb-3 text-[15px] font-bold text-gray-900">Packages</h3>
              <div className="space-y-3">
                {(["basic", "standard", "premium"] as const).map((pkgKey) => (
                  <label key={pkgKey} className="group flex cursor-pointer items-start gap-3">
                    <input
                      type="radio"
                      name="package"
                      value={pkgKey}
                      checked={selectedPackage === pkgKey}
                      onChange={() => setSelectedPackage(pkgKey)}
                      className="mt-1 h-4 w-4 text-[#096b43] focus:ring-[#096b43]"
                    />
                    <div
                      className={`flex-1 rounded border p-3 transition-all ${
                        selectedPackage === pkgKey
                          ? "border-[#096b43] bg-[#f9fdfb]"
                          : "border-gray-200 group-hover:border-gray-300"
                      }`}
                    >
                      <p className="text-[14px] font-semibold capitalize text-gray-900">{pkgKey} Package</p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {packagesInfo[pkgKey].delivery} | {packagesInfo[pkgKey].revisions} |{" "}
                        {packagesInfo[pkgKey].coverage}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200 bg-[#fafafa] p-5">
              <p className="mb-1 text-[14px] font-semibold text-gray-900">Brief: {packagesInfo[selectedPackage].title}</p>
              <p className="mb-3 text-xs leading-relaxed text-gray-500">{packagesInfo[selectedPackage].desc}</p>
              <div className="mb-4 rounded border border-[#f9dcca] bg-[#fdf3e9] p-3 text-xs text-[#9c5c1f]">
                <span className="mb-0.5 block font-bold">Note:</span>
                If the floor plan needs to be re-created or designed based on JPEG images, scanned drawings, or project
                vision, an additional charge will apply due to the extra time and drafting work involved.
              </div>
              <button
                type="button"
                className="w-full rounded bg-[#096b43] py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#075631]"
              >
                Continue
              </button>
            </div>
          </div>

          {/* SELLER CARD */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src={service.sellerImage || "/placeholder.jpg"}
                  alt={service.sellerName || "Seller"}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{service.sellerName || "Sabbir Hossain"}</p>
                <p className="text-xs text-gray-500">Service Provider</p>
              </div>
            </div>
            <div className="mb-4 rounded-lg bg-[#f8f8f8] p-4">
              <h4 className="mb-1.5 text-[14px] font-bold text-gray-900">About Me</h4>
              <div className="text-[13px] leading-relaxed text-gray-700">
                <p>{displayedBio}</p>
              </div>
              {isBioLong && (
                <button
                  type="button"
                  onClick={() => setIsBioExpanded(!isBioExpanded)}
                  className="mt-2 text-[13px] font-semibold text-[#006A4E] hover:underline focus:outline-none"
                >
                  {isBioExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
            <button
              type="button"
              className="w-full rounded bg-[#006A4E] py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#075631]"
            >
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}