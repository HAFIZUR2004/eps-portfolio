"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, Check, Loader2 } from "lucide-react";

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
  recentWorks?: string[];
  faqs?: { question: string; answer: string }[];
}

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.id;

  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<
    "basic" | "standard" | "premium"
  >("basic");
  const [quantity, setQuantity] = useState<string>("1");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/services/${serviceId}`);

        if (!res.ok) throw new Error("Failed to fetch service details");

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

    if (serviceId) fetchServiceDetail();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F6F2] gap-3">
        <Loader2 className="w-8 h-8 text-[#006A4E] animate-spin" />
        <p className="text-gray-600 text-sm font-medium">Loading details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F6F2] p-4 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {error || "Service Not Found"}
        </h2>
        <Link
          href="/services"
          className="text-sm bg-[#006A4E] text-white px-5 py-2.5 rounded-xl font-medium"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  // Gallery Array
  const galleryImages =
    service.images && service.images.length > 0
      ? service.images
      : [service.mainImage || "/placeholder.jpg"];

  // Packages Data
  const packagesInfo = {
    basic: {
      price: service.basicPackage?.price
        ? `$${service.basicPackage.price}`
        : "$10",
      title: service.basicPackage?.title || "Small Building Evacuation Plan",
      desc: service.basicPackage?.desc || "Single Floor • Up to 1,000 sq. ft.",
      delivery: service.basicPackage?.delivery || "1 Day Delivery",
      revisions: service.basicPackage?.revisions || "Unlimited Revisions",
      coverage: service.basicPackage?.coverage || "1,000 sq. ft.",
    },
    standard: {
      price: service.standardPackage?.price
        ? `$${service.standardPackage.price}`
        : "$25",
      title:
        service.standardPackage?.title || "Medium Building Evacuation Plan",
      desc:
        service.standardPackage?.desc || "Up to 2 Floors • Up to 2,500 sq. ft.",
      delivery: service.standardPackage?.delivery || "2 Day Delivery",
      revisions: service.standardPackage?.revisions || "Unlimited Revisions",
      coverage: service.standardPackage?.coverage || "2,500 sq. ft.",
    },
    premium: {
      price: service.premiumPackage?.price
        ? `$${service.premiumPackage.price}`
        : "$50",
      title: service.premiumPackage?.title || "Large Complex Evacuation Plan",
      desc:
        service.premiumPackage?.desc ||
        "Multi-story / Large Factory • Up to 5,000 sq. ft.",
      delivery: service.premiumPackage?.delivery || "3 Day Delivery",
      revisions: service.premiumPackage?.revisions || "Unlimited Revisions",
      coverage: service.premiumPackage?.coverage || "5,000 sq. ft.",
    },
  };

  // FAQ from API or Fallback
  const faqs =
    service.faqs && service.faqs.length > 0
      ? service.faqs
      : [
          {
            question:
              "Do you offer assistance after the order has been completed?",
            answer:
              "Yes, we provide post-delivery assistance for minor updates and revisions.",
          },
          {
            question: "Can I choose my favorite Product category or Niche?",
            answer:
              "Absolutely! You can provide specific instructions, colors, or safety guidelines.",
          },
          {
            question: "Can I add products myself?",
            answer: "Yes, you can request custom modifications anytime.",
          },
          {
            question: "Are there any additional or hidden charges?",
            answer:
              "No, the price you see is the final price unless you require a completely new floor plan design from scratch.",
          },
        ];

  const whyWorkItems = [
    "Flexibility and Customization",
    "Expertise and Specialization",
    "Direct Communication",
  ];

  return (
    <div className="bg-[#F8F6F2] min-h-screen text-gray-800 pb-20">
      {/* Top Banner Header */}
      <div className="bg-[#EFECE6] border-b border-gray-200/80 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <Link href="/services" className="hover:underline">
              Services
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" /> Detail
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {service.title ||
              "We will design professional fire emergency evacuation plan, exit plan and safety plan."}
          </h1>
          <div className="flex items-center gap-1.5 mt-2">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold text-gray-900">
              {service.rating ?? "5.0"}
            </span>
            <span className="text-xs text-gray-500">
              ({service.reviewsCount ?? 0} Reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ================= LEFT COLUMN (CONTENT) ================= */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Main Image Gallery */}
          <div className="relative w-full h-[320px] sm:h-[400px] md:h-[450px] bg-gray-200 rounded-xl overflow-hidden border border-gray-300 shadow-sm">
            {/* Badges */}
            <div className="absolute top-4 left-4 bg-[#096b43] text-white px-3 py-1.5 rounded-l-full rounded-r-full text-xs font-bold shadow-md z-10 leading-tight">
              ENGLISH <br /> LANGUAGE
            </div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#096b43] text-white px-6 py-2 rounded-full text-sm font-bold shadow-md text-center z-10">
              EMERGENCY EVACUATION PLAN DESIGN
              <div className="text-[9px] md:text-[10px] font-normal mt-0.5 opacity-90">
                Premium Quality | Unlimited Revisions | Lifetime Support
              </div>
            </div>

            <Image
              src={selectedImage}
              alt={service.title || "Service Preview"}
              fill
              className="object-contain md:object-cover"
              sizes="(max-width: 1200px) 100vw, 66vw"
            />
          </div>

          {/* 2. Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-24 h-14 md:w-28 md:h-16 rounded overflow-hidden flex-shrink-0 border-2 transition-all bg-white ${
                    selectedImage === img
                      ? "border-[#096b43]"
                      : "border-gray-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumb ${idx}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* 3. About this Gig */}
          <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-[17px] font-bold text-gray-900">
              About this Gig
            </h2>
            <p className="text-[14px] text-gray-700 leading-relaxed whitespace-pre-line">
              {service.aboutGig ||
                "Professional emergency evacuation planning tailored to your exact floor plans and local compliance guidelines."}
            </p>
          </div>

          {/* 4. Why Work With Me */}
          <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-[17px] font-bold text-gray-900">
              Why Work With Me
            </h2>
            <p className="text-[14px] text-gray-700 leading-relaxed mb-2">
              {service.whyWorkWithMe ||
                "Experienced CAD designer specializing in fire safety, site plans, and evacuation mapping."}
            </p>
            <ul className="space-y-1.5 text-[14px] text-gray-700">
              {whyWorkItems.map((item, index) => (
                <li key={index} className="flex items-center gap-2.5">
                  <span className="bg-[#096b43] rounded-full p-0.5 text-white">
                    <Check className="w-3 h-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 5. FAQ Section */}
          <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-[17px] font-bold text-gray-900 mb-4">FAQ</h2>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-100 rounded-lg bg-[#fafafa] overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenFaq(openFaq === index ? null : index)
                    }
                    className="w-full flex items-center justify-between text-left p-3.5 font-medium text-[14px] text-gray-800 hover:text-[#096b43] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="text-gray-400 text-lg">
                      {openFaq === index ? "−" : "+"}
                    </span>
                  </button>
                  {openFaq === index && (
                    <p className="text-[13px] text-gray-600 px-3.5 pb-3.5 pt-1 leading-relaxed border-t border-gray-100 bg-white">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 6. Recent Works */}
          <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-[17px] font-bold text-gray-900 mb-4">
              Recent Works
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {(service.recentWorks || [1, 2, 3, 4]).map((item, i) => (
                <div
                  key={i}
                  className="w-28 h-20 bg-gray-200 rounded border border-gray-300 flex-shrink-0 relative overflow-hidden"
                >
                  {typeof item === "string" ? (
                    <Image
                      src={item}
                      alt={`Recent Work ${i}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-[10px] text-gray-500">
                      Project {item}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN (SIDEBAR / ORDER) ================= */}
        <div className="space-y-6">
          {/* Order Box */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden sticky top-6">
            {/* Price Header */}
            <div className="bg-[#096b43] text-white text-center py-4">
              <div className="text-sm font-light mb-0.5">Price</div>
              <div className="text-3xl font-bold">
                {packagesInfo[selectedPackage].price}
              </div>
            </div>

            {/* Quantity */}
            <div className="p-5 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Quantity
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm bg-white focus:outline-none focus:border-[#096b43]"
              >
                <option value="1">1 Evacuation plan</option>
                <option value="2">2 Evacuation plans</option>
                <option value="3">3 Evacuation plans</option>
              </select>
            </div>

            {/* Packages Radio Selector */}
            <div className="p-5">
              <h3 className="font-bold text-[15px] text-gray-900 mb-3">
                Packages
              </h3>
              <div className="space-y-3">
                {(["basic", "standard", "premium"] as const).map((pkgKey) => (
                  <label
                    key={pkgKey}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="package"
                      value={pkgKey}
                      checked={selectedPackage === pkgKey}
                      onChange={() => setSelectedPackage(pkgKey)}
                      className="mt-1 w-4 h-4 text-[#096b43] focus:ring-[#096b43]"
                    />
                    <div
                      className={`flex-1 border rounded p-3 transition-all ${
                        selectedPackage === pkgKey
                          ? "border-[#096b43] bg-[#f9fdfb]"
                          : "border-gray-200 group-hover:border-gray-300"
                      }`}
                    >
                      <p className="font-semibold text-[14px] text-gray-900 capitalize">
                        {pkgKey} Package
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {packagesInfo[pkgKey].delivery} |{" "}
                        {packagesInfo[pkgKey].revisions} |{" "}
                        {packagesInfo[pkgKey].coverage}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Brief & Note */}
            <div className="p-5 border-t border-gray-200 bg-[#fafafa]">
              <p className="font-semibold text-[14px] text-gray-900 mb-1">
                Brief: {packagesInfo[selectedPackage].title}
              </p>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                {packagesInfo[selectedPackage].desc}
              </p>

              <div className="bg-[#fdf3e9] text-[#9c5c1f] text-xs p-3 rounded border border-[#f9dcca] mb-4">
                <span className="font-bold block mb-0.5">Note:</span>
                If the floor plan needs to be re-created or designed based on
                JPEG images, scanned drawings, or project vision, an additional
                charge will apply due to the extra time and drafting work
                involved.
              </div>

              <button className="w-full bg-[#096b43] text-white font-medium py-2.5 rounded hover:bg-[#075631] transition shadow-sm text-sm">
                Continue
              </button>
            </div>
          </div>

          {/* Seller Info Box */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 relative shrink-0">
                <Image
                  src={service.sellerImage || "/placeholder.jpg"}
                  alt={service.sellerName || "Seller"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  {service.sellerName || "Sabbir Hossain"}
                </p>
                <p className="text-xs text-gray-500">Service Provider</p>
              </div>
            </div>

            <div className="text-[13px] text-gray-700 leading-relaxed mb-4">
              <p>
                {service.sellerBio ||
                  "I am a professional graphic designer & artisan, with over 15 years of experience in fire safety plans and site diagrams."}
              </p>
            </div>

            <button className="w-full bg-[#096b43] text-white font-medium py-2.5 rounded hover:bg-[#075631] transition shadow-sm text-sm">
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}