import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import FiverrReview from '@/models/FiverrReview';

// GET: সকল রিভিউ ইমেজ ফেচ করা
export async function GET() {
  try {
    await connectDB();
    const reviews = await FiverrReview.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch' },
      { status: 500 }
    );
  }
}

// POST: রিভিউ ইমেজ আপলোড
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { reviewSrc } = body; 

    if (!reviewSrc) {
      return NextResponse.json(
        { success: false, message: 'Review image is required' },
        { status: 400 }
      );
    }

    const newReview = await FiverrReview.create({ reviewSrc });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error: any) {
    console.error('POST REVIEW ERROR:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add review' },
      { status: 500 }
    );
  }
}

// DELETE: রিভিউ ইমেজ ডিলিট
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
    }

    await FiverrReview.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete' },
      { status: 500 }
    );
  }
}