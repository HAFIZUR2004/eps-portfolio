import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get user from Clerk
    const session = await auth();
    
    console.log('Admin Session:', session);
    
    // Optional: Add admin check
    // You can check if user has admin role in Clerk metadata
    // const isAdmin = session?.sessionClaims?.metadata?.role === 'admin';
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    
    let filter = {};
    if (status === 'pending') filter = { isApproved: false };
    else if (status === 'approved') filter = { isApproved: true };
    else if (status === 'all') filter = {};
    
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    
    // Always return an array
    return NextResponse.json(Array.isArray(reviews) ? reviews : []);
    
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}