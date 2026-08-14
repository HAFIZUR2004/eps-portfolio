import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Client from '@/models/Client';

// GET: সকল লোগো ফেচ করা
export async function GET() {
  try {
    await connectDB();
    const clients = await Client.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, clients }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch' },
      { status: 500 }
    );
  }
}

// POST: শুধুমাত্র লোগো আপলোড
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { logoSrc } = body;

    if (!logoSrc) {
      return NextResponse.json(
        { success: false, message: 'Logo is required' },
        { status: 400 }
      );
    }

    const newClient = await Client.create({ logoSrc });

    return NextResponse.json({ success: true, client: newClient }, { status: 201 });
  } catch (error: any) {
    // 👈 সার্ভার কন্সোলে মূল Error দেখাবে
    console.error('POST CLIENT ERROR:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add logo' },
      { status: 500 }
    );
  }
}

// DELETE: লোগো ডিলিট
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
    }

    await Client.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete' },
      { status: 500 }
    );
  }
}