import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/models/Portfolio";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await Portfolio.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}