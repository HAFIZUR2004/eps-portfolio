import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";

type Params = {
  params: Promise<{ id: string }>;
};

// GET SINGLE SERVICE
export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Service ID is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const service = await Service.findById(id);

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        service,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET SERVICE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch service",
      },
      { status: 500 }
    );
  }
}


// UPDATE SERVICE
export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Service ID is required",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    await connectDB();

    const galleryImages = Array.isArray(body.gigGalleryImages)
      ? body.gigGalleryImages.filter(
          (img: string) =>
            typeof img === "string" && img.trim() !== ""
        )
      : Array.isArray(body.galleryImages)
      ? body.galleryImages.filter(
          (img: string) =>
            typeof img === "string" && img.trim() !== ""
        )
      : [];

    const recentWorks = Array.isArray(body.recentWorks)
      ? body.recentWorks.filter(
          (img: string) =>
            typeof img === "string" && img.trim() !== ""
        )
      : [];

    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        title: body.title || "",

        rating: String(body.rating || "5.0"),

        reviewsCount: String(
          body.reviewsCount || "0"
        ),

        mainImage: body.mainImage || "",

        galleryImages,

        recentWorks,

        aboutGig: body.aboutGig || "",

        whyWorkWithMe:
          body.whyWorkWithMe || "",

        basicPackage: {
          price: body.basicPrice || "",
          title: body.basicTitle || "",
          desc: body.basicDesc || "",
          delivery:
            body.basicDelivery || "",
        },

        standardPackage: {
          price: body.standardPrice || "",
          title: body.standardTitle || "",
          desc: body.standardDesc || "",
          delivery:
            body.standardDelivery || "",
        },

        premiumPackage: {
          price: body.premiumPrice || "",
          title: body.premiumTitle || "",
          desc: body.premiumDesc || "",
          delivery:
            body.premiumDelivery || "",
        },

        sellerName:
          body.sellerName || "Hafizur Rahman",

        sellerRole:
          body.sellerRole ||
          "Full-Stack Developer",

        sellerImage:
          body.sellerImage || "",

        sellerBio:
          body.sellerBio || "",

        faqs: Array.isArray(body.faqs)
          ? body.faqs
          : [],
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedService) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Service updated successfully",
        service: updatedService,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("UPDATE SERVICE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to update service",
      },
      { status: 500 }
    );
  }
}


// DELETE SERVICE
export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Service ID is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const deletedService =
      await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Service deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE SERVICE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to delete service",
      },
      { status: 500 }
    );
  }
}