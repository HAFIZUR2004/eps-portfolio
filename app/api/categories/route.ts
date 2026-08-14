import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // আপনার DB connection ফাইল
import Category from "@/models/Category"; // আপনার Category মডেল

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { name } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    // Create new category
    const newCategory = new Category({
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-"),
    });

    await newCategory.save();

    return NextResponse.json(
      { category: newCategory, message: "Category created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}

// Optionally add GET to fetch all categories
export async function GET(req: Request) {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 });
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}