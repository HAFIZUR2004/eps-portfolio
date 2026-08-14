import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    
    // Next.js 15+ সেফটি চেক (Promise হলে resolve করবে, না হলে ডিরেক্ট নেবে)
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
    }

    const deletedItem = await Portfolio.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}