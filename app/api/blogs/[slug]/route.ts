import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { currentUser } from "@clerk/nextjs/server";

// GET Single Blog
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;

    const post = await Post.findOne({ slug }).populate(
      "category",
      "name slug"
    );

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST: Add Comment - FIXED
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    // Check Clerk Login
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to comment." },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const body = await req.json();

    // Validate Comment
    if (!body.comment?.trim()) {
      return NextResponse.json(
        { error: "Comment is required." },
        { status: 400 }
      );
    }

    // Get User Information From Clerk
    const name = user.fullName || user.firstName || user.username || "User";
    const email = user.primaryEmailAddress?.emailAddress || "";
    const avatar = user.imageUrl || "";

    // Create Comment - ✅ comment ফিল্ড ব্যবহার করছি
    const newComment = {
      userId: user.id,
      name: name,
      email: email,
      avatar: avatar || "https://ui-avatars.com/api/?name=User&background=006A4E&color=fff&size=100",
      comment: body.comment.trim(), // ✅ comment
      rating: typeof body.rating === "number" ? body.rating : 5,
      date: new Date(),
      isAuthorReply: false,
    };

    // Add Comment to Post
    const post = await Post.findOneAndUpdate(
      { slug },
      {
        $push: {
          comments: newComment,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!post) {
      return NextResponse.json(
        { error: "Post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(post, { status: 200 });
    
  } catch (error: any) {
    console.error("Comment Error:", error);
    
    // Detailed error response
    return NextResponse.json(
      { 
        error: error.message || "Failed to add comment.",
        details: error.errors // যদি validation error হয়
      },
      { status: 500 }
    );
  }
}