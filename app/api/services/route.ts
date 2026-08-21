import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, services }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const galleryImages = Array.isArray(body.gigGalleryImages)
      ? body.gigGalleryImages.filter((img: string) => typeof img === "string" && img.trim() !== "")
      : [];

    const recentWorks = Array.isArray(body.recentWorks)
      ? body.recentWorks.filter((img: string) => typeof img === "string" && img.trim() !== "")
      : [];

    const newService = await Service.create({
      title: body.title,
      rating: String(body.rating || "5.0"),
      reviewsCount: String(body.reviewsCount || "0"),
      mainImage: body.mainImage,
      galleryImages,
      recentWorks,
      aboutGig: body.aboutGig,
      whyWorkWithMe: body.whyWorkWithMe || "",

      basicPackage: {
        price: body.basicPrice || "",
        title: body.basicTitle || "",
        desc: body.basicDesc || "",
        delivery: body.basicDelivery || "",
      },
      standardPackage: {
        price: body.standardPrice || "",
        title: body.standardTitle || "",
        desc: body.standardDesc || "",
        delivery: body.standardDelivery || "",
      },
      premiumPackage: {
        price: body.premiumPrice || "",
        title: body.premiumTitle || "",
        desc: body.premiumDesc || "",
        delivery: body.premiumDelivery || "",
      },

      sellerName: body.sellerName || "Hafizur Rahman",
      sellerRole: body.sellerRole || "Full-Stack Developer",
      sellerImage: body.sellerImage || "",
      sellerBio: body.sellerBio || "",
      faqs: Array.isArray(body.faqs) ? body.faqs : [],
    });

    return NextResponse.json({ success: true, service: newService }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}