import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Service ID is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const service = await Service.findById(id);

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, service }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching service details:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}