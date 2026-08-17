import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { connectDB } from '@/lib/db';
import HeroImage from '@/models/HeroImage';

// -------------------------------------------------------------
// GET: সব হিরো ইমেজ আনা
// -------------------------------------------------------------
export async function GET() {
  try {
    console.log('GET /api/hero called');
    
    await connectDB();
    const images = await HeroImage.find({}).sort({ createdAt: -1 });
    const imageUrls = images.map((img: any) => img.imageUrl);

    return NextResponse.json({
      success: true,
      data: { images: imageUrls },
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// POST: ইমেজ আপলোড করা
// -------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/hero called');
    
    await connectDB();
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      console.log('No file uploaded');
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.log('File received:', file.name, file.size, file.type);

    // ফাইলের সাইজ চেক (10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.log('File too large:', file.size);
      return NextResponse.json(
        { success: false, message: 'File too large (max 10MB)' },
        { status: 400 }
      );
    }

    // ফাইলের টাইপ চেক
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json(
        { success: false, message: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // ইউনিক ফাইলের নাম তৈরি
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `hero-${timestamp}.${ext}`;

    // আপলোড ফোল্ডার তৈরি (যদি না থাকে)
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    console.log('Upload directory:', uploadDir);
    
    if (!existsSync(uploadDir)) {
      console.log('Creating upload directory...');
      await mkdir(uploadDir, { recursive: true });
    }

    // ফাইল সেভ করা
    console.log('Saving file...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);
    console.log('File saved successfully:', filePath);

    // ইমেজ URL (যা ডাটাবেসে সেভ হবে)
    const imageUrl = `/uploads/${filename}`;

    // ডাটাবেসে সেভ করা
    console.log('Saving to database:', imageUrl);
    const newImage = await HeroImage.create({ imageUrl });
    console.log('Database insert successful:', newImage);

    return NextResponse.json({
      success: true,
      image: imageUrl,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('POST error details:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// DELETE: ইমেজ ডিলিট করা
// -------------------------------------------------------------
export async function DELETE(req: NextRequest) {
  try {
    console.log('DELETE /api/hero called');
    
    await connectDB();
    const body = await req.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: 'Image URL required' },
        { status: 400 }
      );
    }

    console.log('Deleting image:', imageUrl);

    // ডাটাবেস থেকে রেকর্ড ডিলিট
    await HeroImage.findOneAndDelete({ imageUrl });

    // ফাইল সিস্টেম থেকে ইমেজ ডিলিট
    const filename = imageUrl.replace('/uploads/', '');
    const filePath = join(process.cwd(), 'public', 'uploads', filename);

    try {
      await unlink(filePath);
      console.log('File deleted:', filePath);
    } catch (err) {
      console.warn('File not found:', filePath);
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Delete failed' },
      { status: 500 }
    );
  }
}