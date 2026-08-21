import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import cloudinary from "@/lib/cloudinary";

// ✅ App Router-এ বডি সাইজ লিমিট বা কনফিগারেশন এভাবে দিতে হয়
export const maxDuration = 60; // Max execution duration in seconds

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "requirements";

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // File validation
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // File size validation (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `fire-evacuation/${folder}`,
          resource_type: "auto",
          transformation: [
            { quality: "auto" },
            { fetch_format: "auto" }
          ]
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.on("error", (error) => {
        console.error("Stream error:", error);
        reject(error);
      });

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: (uploadResult as any).secure_url,
      public_id: (uploadResult as any).public_id,
    });

  } catch (error: any) {
    console.error("Upload error:", error);

    let errorMessage = "Upload failed";
    let statusCode = 500;

    if (error.message?.includes("File too large")) {
      errorMessage = "File is too large. Maximum size is 5MB.";
      statusCode = 413;
    } else if (error.message?.includes("Invalid file type")) {
      errorMessage = "Invalid file type. Please upload an image.";
      statusCode = 400;
    } else if (error.message?.includes("Cloudinary")) {
      errorMessage = "Cloudinary upload failed. Please try again.";
      statusCode = 502;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}