import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import RequirementStep from '@/models/RequirementStep';
import RequirementImage from '@/models/RequirementImage';

// GET: Steps + Images একসাথে ফেচ
export async function GET(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all';

    let steps = [];
    let images = [];

    if (type === 'all' || type === 'steps') {
      steps = await RequirementStep.find({}).sort({ order: 1 });
      console.log('Steps fetched:', steps.length); // ✅ ডিবাগ
    }
    if (type === 'all' || type === 'images') {
      images = await RequirementImage.find({}).sort({ order: 1 });
      console.log('Images fetched:', images.length); // ✅ ডিবাগ
    }

    return NextResponse.json({ success: true, steps, images });
  } catch (error: any) {
    console.error('GET Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: নতুন Step বা Image যোগ
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    console.log('POST body:', body); // ✅ ডিবাগ
    const { type, ...data } = body;

    let newItem;
    if (type === 'step') {
      newItem = await RequirementStep.create(data);
    } else if (type === 'image') {
      newItem = await RequirementImage.create(data);
    } else {
      return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT: Step বা Image আপডেট
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { _id, type, ...updateData } = body;

    if (!_id || !type) {
      return NextResponse.json({ success: false, message: 'ID and type required' }, { status: 400 });
    }

    let updatedItem;
    if (type === 'step') {
      updatedItem = await RequirementStep.findByIdAndUpdate(_id, updateData, { new: true });
    } else if (type === 'image') {
      updatedItem = await RequirementImage.findByIdAndUpdate(_id, updateData, { new: true });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error: any) {
    console.error('PUT Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Step বা Image ডিলিট
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      return NextResponse.json({ success: false, message: 'ID and type required' }, { status: 400 });
    }

    if (type === 'step') {
      await RequirementStep.findByIdAndDelete(id);
    } else if (type === 'image') {
      await RequirementImage.findByIdAndDelete(id);
    } else {
      return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}