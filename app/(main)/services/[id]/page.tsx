"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, Check, Loader2, ZoomIn } from "lucide-react"; // ✅ ZoomIn added

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
  recentWorks?: string[];
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

  // STATES
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [otherServices, setOtherServices] = useState<ServiceData[]>([]);
  const [loadingOther, setLoadingOther] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<"basic" | "standard" | "premium">("basic");
  const [quantity, setQuantity] = useState<string>("1");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isBioExpanded, setIsBioExpanded] = useState<boolean>(false);

  // FETCH SERVICE DETAILS
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

  // FETCH OTHER SERVICES
  useEffect(() => {
    const fetchOtherServices = async () => {
      if (!serviceId) return;
      try {
        setLoadingOther(true);
        const res = await fetch("/api/services", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        if (data?.success && Array.isArray(data.services)) {
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

  // LOADING STATE
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#F8F6F2]">
        <Loader2 className="h-8 w-8 animate-spin text-[#006A4E]" />
        <p className="text-sm font-medium text-gray-600">Loading details...</p>
      </div>
    );
  }

  // ERROR STATE
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

  // GALLERY IMAGES COMBINATION
  const allGalleryImages = Array.from(
    new Set(
      [
        service.mainImage,
        ...(Array.isArray(service.images) ? service.images : []),
        ...(Array.isArray(service.recentWorks) ? service.recentWorks : []),
      ].filter(Boolean) as string[]
    )
  );

  // PACKAGES INFO
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

  // FAQS
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

  const whyWorkItems = [
    "Flexibility and Customization",
    "Expertise and Specialization",
    "Direct Communication",
  ];

  const defaultBio =
    "I am a professional graphic designer & artisan, with over 15 years of experience in fire safety plans and site diagrams.";
  const bioText = service.sellerBio || defaultBio;
  const bioLimit = 120;
  const isBioLong = bioText.length > bioLimit;
  const displayedBio = isBioExpanded || !isBioLong ? bioText : `${bioText.slice(0, bioLimit)}...`;

  return (
    <div className="min-h-screen bg-[#F8F6F2] pb-20 text-gray-800">
      {/* PAGE HEADER */}
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

      {/* MAIN CONTENT */}
      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {/* LEFT CONTENT */}
        <div className="space-y-8 lg:col-span-2">
          
          {/* MAIN IMAGE PREVIEW - FIXED */}
          <div className="group relative h-[320px] w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:h-[400px] md:h-[450px] lg:h-[500px]">
            <Image
              src={selectedImage || "/placeholder.jpg"}
              alt={service.title || "Service Preview"}
              fill
              priority
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 1200px) 100vw, 66vw"
            />
            
            {/* Zoom Badge */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <ZoomIn className="h-3.5 w-3.5" />
              Hover to zoom
            </div>
          </div>

          {/* GIG GALLERY THUMBNAILS */}
          {allGalleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
              {allGalleryImages.map((img, idx) => {
                const isActive = selectedImage === img;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 md:h-20 md:w-32 ${
                      isActive
                        ? "border-[#006A4E] opacity-100 scale-105 shadow-md"
                        : "border-gray-300 opacity-60 hover:border-gray-400 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Gallery thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </button>
                );
              })}
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
                  <span className="rounded-full bg-[#006A4E] p-0.5 text-white">
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
                    className="flex w-full items-center justify-between p-3.5 text-left text-[14px] font-medium text-gray-800 transition-colors hover:text-[#006A4E]"
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

          {/* RECENT PROJECTS */}
         {/* RECENT PROJECTS */}
<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
  {/* Section Header */}
  <div className="mb-5 flex items-center justify-between">
    <div>
      <h2 className="text-[17px] font-bold text-gray-900">
        Recent Projects
      </h2>
      <p className="mt-1 text-xs text-gray-500">
        Explore some of our latest safety & evacuation projects.
      </p>
    </div>

    <Link
      href="/services"
      className="group inline-flex items-center gap-1 text-xs font-semibold text-[#006A4E] transition hover:text-[#075631]"
    >
      View All
      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </Link>
  </div>

  {/* Projects */}
  {loadingOther ? (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="aspect-[1.414/1] animate-pulse rounded-xl bg-gray-100"
        />
      ))}
    </div>
  ) : otherServices.length > 0 ? (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {otherServices.map((item) => (
        <Link
          key={item._id}
          href={`/services/${item._id}`}
          className="group block"
        >
          <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#006A4E]/40 group-hover:shadow-lg">
            
            {/* Image */}
            <div className="relative aspect-[1.414/1] overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-100">
              <Image
                src={item.mainImage || "/placeholder.jpg"}
                alt={item.title || "Project"}
                fill
                className="object-contain p-1.5 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 50vw, 25vw"
              />

              {/* Soft overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* View icon */}
              <div className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-700 opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                <ZoomIn className="h-3.5 w-3.5" />
              </div>

              {/* View Project */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="block truncate rounded-lg bg-white/95 px-2.5 py-1.5 text-center text-[10px] font-bold text-gray-900 shadow-sm backdrop-blur-sm">
                  View Project
                </span>
              </div>
            </div>

            {/* Project Info */}
            <div className="border-t border-gray-100 bg-white px-3 py-2.5">
              <p className="truncate text-xs font-semibold text-gray-900 transition-colors group-hover:text-[#006A4E]">
                {item.title || "Untitled Project"}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-gray-400">
                {item.category || "Safety Project"}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center">
      <p className="text-sm font-medium text-gray-500">
        No projects available.
      </p>
      <p className="mt-1 text-xs text-gray-400">
        Recent projects will appear here.
      </p>
    </div>
  )}
</div>





        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* PACKAGE CARD */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="bg-[#006A4E] py-4 text-center text-white">
              <div className="mb-0.5 text-sm font-light">Price</div>
              <div className="text-3xl font-bold">{packagesInfo[selectedPackage].price}</div>
            </div>
            <div className="border-b border-gray-200 p-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Quantity</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white p-2 text-sm focus:border-[#006A4E] focus:outline-none"
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
                      className="mt-1 h-4 w-4 text-[#006A4E] focus:ring-[#006A4E]"
                    />
                    <div
                      className={`flex-1 rounded border p-3 transition-all ${
                        selectedPackage === pkgKey
                          ? "border-[#006A4E] bg-[#f9fdfb]"
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
              <p className="mb-1 text-[14px] font-semibold text-gray-900">
                Brief: {packagesInfo[selectedPackage].title}
              </p>
              <p className="mb-3 text-xs leading-relaxed text-gray-500">
                {packagesInfo[selectedPackage].desc}
              </p>
              <div className="mb-4 rounded border border-[#f9dcca] bg-[#fdf3e9] p-3 text-xs text-[#9c5c1f]">
                <span className="mb-0.5 block font-bold">Note:</span>
                If the floor plan needs to be re-created or designed based on JPEG images, scanned drawings, or project
                vision, an additional charge will apply due to the extra time and drafting work involved.
              </div>
              <button
                type="button"
                className="w-full rounded bg-[#006A4E] py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#075631]"
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