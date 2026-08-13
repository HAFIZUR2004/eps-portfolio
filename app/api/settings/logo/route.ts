import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SiteSetting from '@/models/SiteSetting';

// 1. লোগো ফেচ করা (GET)
export async function GET() {
  try {
    await connectDB();
    const setting = await SiteSetting.findOne();
    return NextResponse.json({ logoUrl: setting?.logoUrl || '/logo2.png' });
  } catch (error) {
    return NextResponse.json({ logoUrl: '/logo2.png' }, { status: 500 });
  }
}

// 2. লোগো আপডেট করা (POST)
export async function POST(req: Request) {
  try {
    await connectDB();
    const { logoUrl } = await req.json();

    // আগের রেকর্ডটি খুঁজে আপডেট করবে, না থাকলে নতুন বানাবে (findOneAndUpdate + upsert)
    const setting = await SiteSetting.findOneAndUpdate(
      {},
      { logoUrl },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, logoUrl: setting.logoUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update logo' }, { status: 500 });
  }
}