import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FAQ from "@/models/FAQ";
import FAQImage from "@/models/FAQImage";
import { currentUser } from "@clerk/nextjs/server";

// Dynamic routing optimize করার জন্য Edge/Node Server runtime optimization
export const dynamic = "force-dynamic";

// GET - Fetch all FAQs and Images in Parallel
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    let faqsPromise = Promise.resolve(null as any);
    let imagesPromise = Promise.resolve(null as any);

    // Promise.all-এর মাধ্যমে সমান্তরালভাবে (Parallel) ডাটা ক্যোয়ারি করা
    if (type === 'all' || type === 'faqs') {
      faqsPromise = FAQ.find({ isActive: true })
        .select('id question answer order') // শুধু প্রয়োজনীয় ফিল্ড
        .sort({ order: 1 })
        .lean();
    }

    if (type === 'all' || type === 'images') {
      imagesPromise = FAQImage.find({ isActive: true })
        .select('imageUrl alt position order') // শুধু প্রয়োজনীয় ফিল্ড
        .sort({ order: 1 })
        .lean();
    }

    const [faqs, images] = await Promise.all([faqsPromise, imagesPromise]);

    const response: Record<string, any> = { success: true };
    if (faqs) response.faqs = faqs;
    if (images) response.images = images;

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("FAQ GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

// POST - Create new FAQ or Image
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { type, data } = body;

    if (type === 'faq') {
      const { id, question, answer, order } = data;
      if (!id || !question || !answer) {
        return NextResponse.json({ success: false, error: "ID, question, and answer are required" }, { status: 400 });
      }

      const faq = await FAQ.create({ id, question, answer, order: order || 0, isActive: true });
      return NextResponse.json({ success: true, faq }, { status: 201 });
    }

    if (type === 'image') {
      const { imageUrl, alt, position, order } = data;
      if (!imageUrl || !position) {
        return NextResponse.json({ success: false, error: "Image URL and position are required" }, { status: 400 });
      }

      // Warning Check: Base64 String ডাটাবেজে সেভ হতে দিলে ডাটাবেজ স্লো হবে
      if (imageUrl.startsWith('data:image')) {
        return NextResponse.json(
          { success: false, error: "Base64 images are too heavy. Please use Cloudinary/S3 image URL." },
          { status: 400 }
        );
      }

      const image = await FAQImage.create({ imageUrl, alt: alt || "FAQ Image", position, order: order || 0, isActive: true });
      return NextResponse.json({ success: true, image }, { status: 201 });
    }

    return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    console.error("FAQ POST Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create FAQ" }, { status: 500 });
  }
}

// PUT - Update FAQ or Image
export async function PUT(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { type, id, data } = body;

    if (type === 'faq') {
      const faq = await FAQ.findByIdAndUpdate(id, { ...data }, { new: true, runValidators: true }).lean();
      if (!faq) return NextResponse.json({ success: false, error: "FAQ not found" }, { status: 404 });
      return NextResponse.json({ success: true, faq });
    }

    if (type === 'image') {
      const image = await FAQImage.findByIdAndUpdate(id, { ...data }, { new: true, runValidators: true }).lean();
      if (!image) return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 });
      return NextResponse.json({ success: true, image });
    }

    return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    console.error("FAQ PUT Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update FAQ" }, { status: 500 });
  }
}

// DELETE - Delete FAQ or Image
export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ success: false, error: "Type and ID are required" }, { status: 400 });
    }

    if (type === 'faq') {
      const faq = await FAQ.findByIdAndDelete(id);
      if (!faq) return NextResponse.json({ success: false, error: "FAQ not found" }, { status: 404 });
      return NextResponse.json({ success: true, message: "FAQ deleted" });
    }

    if (type === 'image') {
      const image = await FAQImage.findByIdAndDelete(id);
      if (!image) return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 });
      return NextResponse.json({ success: true, message: "Image deleted" });
    }

    return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    console.error("FAQ DELETE Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to delete" }, { status: 500 });
  }
}