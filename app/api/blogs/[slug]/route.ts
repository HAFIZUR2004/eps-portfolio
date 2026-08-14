import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";

// GET Single Blog
export async function GET(
  req: Request, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const post = await Post.findOne({ slug }).populate("category", "name slug");

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Add Comment to Blog
export async function POST(
  req: Request, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const commentData = await req.json();

    const post = await Post.findOneAndUpdate(
      { slug },
      { $push: { comments: commentData } },
      { new: true }
    );

    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update Blog
export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const body = await req.json();

    // Slug আপডেট করার সময় ইউনিক চেক
    if (body.slug && body.slug !== slug) {
      const existingPost = await Post.findOne({ slug: body.slug });
      if (existingPost) {
        return NextResponse.json(
          { error: "A blog post with this slug already exists." },
          { status: 400 }
        );
      }
    }

    const post = await Post.findOneAndUpdate(
      { slug },
      body,
      { returnDocument: 'after', runValidators: true }
    );

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/blogs/[slug] Error:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A blog post with this title/slug already exists." },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ error: error.message || "Failed to update blog" }, { status: 500 });
  }
}

// DELETE: Delete Blog
export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    
    const post = await Post.findOneAndDelete({ slug });

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/blogs/[slug] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete blog" }, { status: 500 });
  }
}