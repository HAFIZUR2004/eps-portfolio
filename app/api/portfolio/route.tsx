import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";

// 📥 পোর্টফোলিও আইটেমস ফেচ করা
export async function GET() {
  try {
    await connectDB();
    const items = await Portfolio.find({}).sort({ createdAt: -1 });

    const categoryCounts: Record<string, number> = {};
    items.forEach((item) => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    const categories = [
      { name: "All Categories", count: items.length },
      ...Object.keys(categoryCounts).map((cat) => ({
        name: cat,
        count: categoryCounts[cat],
      })),
    ];

    return NextResponse.json({ items, categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Data fetch failed" }, { status: 500 });
  }
}

// 📤 নতুন পোর্টফোলিও যোগ করা
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newItem = await Portfolio.create(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Create item failed" }, { status: 500 });
  }
}