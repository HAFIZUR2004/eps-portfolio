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

// POST: Add Comment
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    // ==========================================
    // Check Clerk Login
    // ==========================================

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "You must be logged in to comment.",
        },
        { status: 401 }
      );
    }

    const { slug } = await params;

    const body = await req.json();

    // ==========================================
    // Validate Comment
    // ==========================================

    if (!body.comment?.trim()) {
      return NextResponse.json(
        {
          error: "Comment is required.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // Get User Information From Clerk
    // ==========================================

    const name =
      user.fullName ||
      user.firstName ||
      user.username ||
      "User";

    const email =
      user.primaryEmailAddress?.emailAddress || "";

    const avatar = user.imageUrl || "";

    // ==========================================
    // Create Comment
    // ==========================================
const newComment = {
  userId: user.id,
  name,
  email,
  avatar: user.imageUrl || "",
  text: body.comment.trim(),
  rating: typeof body.rating === "number" ? body.rating : 5,
  createdAt: new Date(),
  isAuthorReply: false,
};

    // ==========================================
    // Add Comment
    // ==========================================

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
        {
          error: "Post not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(post, {
      status: 200,
    });
  } catch (error: any) {
    console.error("Comment Error:", error);

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to add comment.",
      },
      { status: 500 }
    );
  }
}