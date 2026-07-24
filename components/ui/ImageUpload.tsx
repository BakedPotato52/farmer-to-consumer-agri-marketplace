"use client";

import { useState, useRef } from "react";
import { MdCloudUpload, MdDelete, MdImage, MdCheckCircle } from "react-icons/md";
import { AiOutlineReload } from "react-icons/ai";

interface ImageUploadProps {
  label?: string;
  initialImages?: string[];
  multiple?: boolean;
  maxFiles?: number;
  onImagesChange?: (urls: string[]) => void;
  name?: string;
}

export default function ImageUpload({
  label = "Upload Images",
  initialImages = [],
  multiple = true,
  maxFiles = 5,
  onImagesChange,
  name = "images",
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxFiles) {
      setError(`You can upload a maximum of ${maxFiles} images.`);
      return;
    }

    setError(null);
    setIsUploading(true);

    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.ok && data.url) {
          newUrls.push(data.url);
        } else {
          setError(data.error || "Failed to upload image to Cloudinary.");
        }
      } catch (err: any) {
        console.error("Upload error:", err);
        setError("Network error occurred during image upload.");
      }
    }

    if (newUrls.length > 0) {
      const updated = multiple ? [...images, ...newUrls] : [newUrls[0]];
      setImages(updated);
      onImagesChange?.(updated);
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updated);
    onImagesChange?.(updated);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-semibold text-on-surface-variant">
          {label}
        </label>
      )}

      {/* Hidden inputs to pass data to server actions / forms */}
      <input type="hidden" name={name} value={images.join(",")} />

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-3">
          {images.map((url, idx) => (
            <div
              key={url + idx}
              className="relative group rounded-2xl overflow-hidden border border-outline-variant/30 aspect-square bg-surface-container-low shadow-sm"
            >
              <img
                src={url}
                alt={`Uploaded image ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-2 rounded-full bg-error/90 text-on-error hover:bg-error transition-colors"
                  title="Remove image"
                >
                  <MdDelete className="text-lg" />
                </button>
              </div>
              {idx === 0 && (
                <span className="absolute top-2 left-2 bg-primary/90 text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <MdCheckCircle /> Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dropzone Upload Button */}
      {(!multiple && images.length >= 1) ? null : images.length < maxFiles && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
            isUploading
              ? "border-primary/40 bg-primary/5 cursor-wait"
              : "border-outline-variant/40 hover:border-primary/60 bg-white/40 hover:bg-white/70"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          {isUploading ? (
            <>
              <AiOutlineReload className="animate-spin text-3xl text-primary" />
              <p className="text-xs font-semibold text-primary">Uploading to Cloudinary...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <MdCloudUpload className="text-2xl" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  Click or drag images to upload
                </p>
                <p className="text-xs text-outline mt-0.5">
                  PNG, JPG, WEBP up to 10MB (Cloudinary Powered)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs font-medium text-error flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
