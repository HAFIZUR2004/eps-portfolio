import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

// GET - Get approved reviews for landing page
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'approved';
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const isApproved = status === 'approved';
    
    const reviews = await Review.find({ isApproved })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    const formattedReviews = reviews.map((review: any) => ({
      id: review._id,
      name: review.name,
      country: review.title || 'Unknown',
      rating: review.rating,
      comment: review.comment,
      initialBg: `bg-${['amber','sky','emerald','purple','pink'][Math.floor(Math.random() * 5)]}-600`,
      avatar: review.avatar || null,
      createdAt: review.createdAt,
      time: new Date(review.createdAt).toLocaleDateString(),
    }));
    
    return NextResponse.json(formattedReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Submit new review
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get the session from Clerk
    const session = await auth();
    
    console.log('Session for POST:', session);
    
    // Check if user is authenticated
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a review' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.comment || !body.rating || !body.title) {
      return NextResponse.json(
        { error: 'Title, comment, and rating are required' },
        { status: 400 }
      );
    }

    // Validate rating
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create new review with pending approval
    const review = await Review.create({
      userId: session.userId,
      name: body.name || 'Anonymous',
      email: body.email || 'no-email@provided.com',
      avatar: body.avatar || '',
      title: body.title,
      rating: parseInt(body.rating),
      comment: body.comment,
      isApproved: false,
    });

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully and is pending approval',
      review: {
        id: review._id,
        name: review.name,
        title: review.title,
        rating: review.rating,
        comment: review.comment,
        isApproved: review.isApproved,
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review. Please try again.' },
      { status: 500 }
    );
  }
}