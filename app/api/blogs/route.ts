import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import Category from "@/models/Category";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const categorySlug = searchParams.get("category") || "";

    let query: any = {};

    // Dashboard-এর জন্য published চেক তুলে দেয়া হলো যেন সব পোস্ট দেখা যায়
    // যদি ফ্রন্টএন্ড Public UI হয়, তবে published: true ফিল্টার রাখবেন
    if (searchParams.get("public") === "true") {
      query.published = true;
    }

    // Search Filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Category Filter
    if (categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug });
      if (cat) query.category = cat._id;
    }

    const posts = await Post.find(query)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    const recentPosts = await Post.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("category", "name");

    // Aggregate category counts dynamically
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "posts", // নিশ্চিত করুন MongoDB-তে কেলকশনের নাম 'posts'
          localField: "_id",
          foreignField: "category",
          as: "postsCount",
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          count: { $size: "$postsCount" },
        },
      },
    ]);

    return NextResponse.json({ posts, categories, recentPosts }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/blogs Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create New Blog
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { title, slug, excerpt, content, image, category, tags } = body;

    // 1. Required Field Validation Check
    if (!title || !slug || !excerpt || !content || !image || !category) {
      return NextResponse.json(
        { error: "Missing required fields (title, slug, excerpt, content, image, category)" },
        { status: 400 }
      );
    }

    // 2. Safely Prepare Post Payload
    const postData = {
      title,
      slug,
      excerpt,
      content,
      image,
      category,
      tags: tags || [],
      published: true, // Auto publish post when created
      // Schema-তে author থাকলে প্রয়োজন অনুযায়ী ডিফল্ট ভ্যালু দিন
      // author: body.author || "Admin", 
    };

    const post = await Post.create(postData);

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/blogs Error Details:", error);

    // Mongoose Duplicate Key Error (Unique Slug Check)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A blog post with this title/slug already exists." },
        { status: 400 }
      );
    }

    // Mongoose Cast Error (Invalid Category ID Format)
    if (error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid Category ID format provided." },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: error.message || "Failed to create blog" }, { status: 500 });
  }
}