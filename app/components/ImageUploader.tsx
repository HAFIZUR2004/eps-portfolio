"use client";

import { CldUploadButton } from "next-cloudinary";
import { useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

interface ImageUploaderProps {
  onImageUpload: (url: string) => void; // ছবির URL প্যারেন্ট কম্পোনেন্টে পাঠানোর জন্য
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleSuccess = (result: any) => {
    const uploadedUrl = result?.info?.secure_url;
    if (uploadedUrl) {
      setImageUrl(uploadedUrl);
      onImageUpload(uploadedUrl); // ডাটাবেসে সেভ করার জন্য parent state-এ পাঠানো
    }
  };

  const handleRemove = () => {
    setImageUrl("");
    onImageUpload("");
  };

  return (
    <div className="space-y-4">
      {!imageUrl ? (
        <CldUploadButton
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "eps_preset"}
          onSuccess={handleSuccess}
          className="border-2 border-dashed border-gray-300 hover:border-[#006A4E] hover:bg-emerald-50/30 transition-all w-full h-40 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer p-4"
        >
          <div className="p-3 bg-emerald-100/60 rounded-full text-[#006A4E]">
            <ImagePlus className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-gray-700">Click to upload or drag & drop</p>
          <p className="text-[11px] text-gray-400">PNG, JPG, WEBP up to 10MB</p>
        </CldUploadButton>
      ) : (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-200 group">
          <Image
            src={imageUrl}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}