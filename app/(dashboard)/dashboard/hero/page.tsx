'use client';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import Image from 'next/image';

import {
  Upload,
  Trash2,
  Loader2,
  ImageIcon,
} from 'lucide-react';

export default function HeroDashboardPage() {
  const [images, setImages] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [deleting, setDeleting] = useState<string | null>(
    null
  );

  const fileInputRef =
    useRef<HTMLInputElement>(null);


  // ==========================================================
  // GET HERO IMAGES
  // ==========================================================

  const fetchHeroImages = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/hero', {
        cache: 'no-store',
      });

      const result = await res.json();

      if (result.success) {
        setImages(result.data?.images || []);
      }
    } catch (error) {
      console.error(
        'Failed to fetch hero images:',
        error
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchHeroImages();
  }, []);


  // ==========================================================
  // OPEN FILE SELECTOR
  // ==========================================================

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };


  // ==========================================================
  // UPLOAD IMAGE
  // ==========================================================

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;


    // --------------------------------------------------------
    // IMAGE CHECK
    // --------------------------------------------------------

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }


    // --------------------------------------------------------
    // SIZE CHECK
    // --------------------------------------------------------

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB.');
      return;
    }


    try {
      setUploading(true);

      const formData = new FormData();

      formData.append('image', file);


      const res = await fetch('/api/hero', {
        method: 'POST',
        body: formData,
      });


      const result = await res.json();


      if (!res.ok || !result.success) {
        throw new Error(
          result.message || 'Upload failed'
        );
      }


      // ------------------------------------------------------
      // UPDATE UI
      // ------------------------------------------------------

      if (result.image) {
        setImages((prev) => [
          ...prev,
          result.image,
        ]);
      } else {
        fetchHeroImages();
      }


      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error(
        'Upload error:',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Image upload failed.'
      );
    } finally {
      setUploading(false);
    }
  };


  // ==========================================================
  // DELETE IMAGE
  // ==========================================================

  const handleDelete = async (
    imageUrl: string
  ) => {

    const confirmDelete =
      window.confirm(
        'Are you sure you want to delete this image?'
      );

    if (!confirmDelete) return;


    try {
      setDeleting(imageUrl);


      const res = await fetch('/api/hero', {
        method: 'DELETE',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          imageUrl,
        }),
      });


      const result = await res.json();


      if (!res.ok || !result.success) {
        throw new Error(
          result.message || 'Delete failed'
        );
      }


      // Remove from UI
      setImages((prev) =>
        prev.filter(
          (image) => image !== imageUrl
        )
      );

    } catch (error) {
      console.error(
        'Delete error:',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete image.'
      );
    } finally {
      setDeleting(null);
    }
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">


        {/* ====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <h1
              className="
                text-2xl
                font-bold
                text-slate-900
                sm:text-3xl
              "
            >
              Hero Images
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Upload or delete Hero section images.
            </p>

          </div>


          {/* ==================================================
              UPLOAD BUTTON
          =================================================== */}

          <div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={handleUploadClick}
              disabled={uploading}
              className="
                inline-flex
                items-center
                justify-center
                gap-2

                rounded-lg

                bg-[#006A4E]

                px-5
                py-3

                text-sm
                font-semibold
                text-white

                shadow-sm

                transition-all

                hover:bg-[#00563f]

                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {uploading ? (
                <>
                  <Loader2
                    className="
                      h-4
                      w-4
                      animate-spin
                    "
                  />

                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />

                  Upload Image
                </>
              )}

            </button>

          </div>

        </div>


        {/* ====================================================
            LOADING
        ===================================================== */}

        {loading ? (

          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center

              rounded-xl

              border
              border-slate-200

              bg-white
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                text-slate-500
              "
            >

              <Loader2
                className="
                  h-5
                  w-5
                  animate-spin
                "
              />

              Loading images...

            </div>

          </div>

        ) : images.length === 0 ? (

          /* ==================================================
             EMPTY
          =================================================== */

          <div
            className="
              flex
              min-h-[350px]
              flex-col
              items-center
              justify-center

              rounded-xl

              border
              border-dashed
              border-slate-300

              bg-white

              px-6

              text-center
            "
          >

            <div
              className="
                mb-4
                flex
                h-16
                w-16
                items-center
                justify-center

                rounded-full

                bg-slate-100
              "
            >
              <ImageIcon
                className="
                  h-7
                  w-7
                  text-slate-400
                "
              />
            </div>


            <h2
              className="
                text-lg
                font-semibold
                text-slate-800
              "
            >
              No Hero Images
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Upload an image to display it
              in the Hero section.
            </p>


            <button
              type="button"
              onClick={handleUploadClick}
              className="
                mt-5

                inline-flex
                items-center
                gap-2

                rounded-lg

                bg-slate-900

                px-5
                py-2.5

                text-sm
                font-semibold
                text-white

                transition

                hover:bg-slate-700
              "
            >

              <Upload className="h-4 w-4" />

              Upload Image

            </button>

          </div>

        ) : (

          /* ==================================================
             IMAGE GRID
          =================================================== */

          <div
            className="
              grid
              grid-cols-1
              gap-5

              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >

            {images.map(
              (imageUrl, index) => (

                <div
                  key={`${imageUrl}-${index}`}
                  className="
                    group
                    overflow-hidden

                    rounded-xl

                    border
                    border-slate-200

                    bg-white

                    shadow-sm

                    transition-all

                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                >

                  {/* IMAGE */}
                  <div
                    className="
                      relative
                      aspect-[4/3]
                      w-full

                      overflow-hidden

                      bg-slate-100
                    "
                  >

                    <Image
                      src={imageUrl}
                      alt={`Hero image ${index + 1}`}
                      fill
                      className="
                        object-contain
                        p-2

                        transition-transform
                        duration-300

                        group-hover:scale-[1.02]
                      "
                      sizes="
                        (max-width: 640px) 100vw,
                        (max-width: 1024px) 50vw,
                        25vw
                      "
                    />

                  </div>


                  {/* DELETE */}
                  <div
                    className="
                      flex
                      items-center
                      justify-end

                      border-t
                      border-slate-100

                      p-3
                    "
                  >

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(imageUrl)
                      }
                      disabled={
                        deleting === imageUrl
                      }
                      className="
                        inline-flex
                        items-center
                        gap-2

                        rounded-lg

                        bg-red-50

                        px-3
                        py-2

                        text-xs
                        font-semibold
                        text-red-600

                        transition

                        hover:bg-red-100

                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >

                      {deleting === imageUrl ? (
                        <>
                          <Loader2
                            className="
                              h-4
                              w-4
                              animate-spin
                            "
                          />

                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2
                            className="h-4 w-4"
                          />

                          Delete
                        </>
                      )}

                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}