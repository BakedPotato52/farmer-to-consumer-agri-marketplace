import { NextResponse } from "next/server";
import crypto from "crypto";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Rate Limit: max 4 image uploads per minute per IP
    const rateLimit = await checkRateLimit(`upload:${clientIp}`, 4, 60);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Upload rate limit exceeded. Bot prevention active. Please wait ${rateLimit.resetInSeconds} seconds before uploading again.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetInSeconds),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
          },
        },
      );
    }

    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      "kanak-acharya";

    // Parse API secret from CLOUDINARY_API_SECRET or CLOUDINARY_URL
    let apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiSecret && process.env.CLOUDINARY_URL) {
      const match = process.env.CLOUDINARY_URL.match(
        /cloudinary:\/\/[^:]+:([^@]+)@/,
      );
      if (match) apiSecret = match[1];
    }

    const apiKey =
      process.env.CLOUDINARY_API_KEY ||
      process.env.CLOUDINARY_URL?.match(/cloudinary:\/\/([^:]+):/)?.[1];

    const uploadPreset =
      process.env.CLOUDINARY_UPLOAD_PRESET ||
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
      "farm-fresh";

    let fileData: string | Blob;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      if (!file) {
        return NextResponse.json(
          { error: "No file provided in form data" },
          { status: 400 },
        );
      }
      fileData = file as Blob;
    } else {
      const json = await request.json();
      if (!json.file) {
        return NextResponse.json(
          { error: "No file string provided in JSON payload" },
          { status: 400 },
        );
      }
      fileData = json.file;
    }

    // 1. Try Unsigned Upload first with upload_preset
    const unsignedFormData = new FormData();
    unsignedFormData.append("file", fileData);
    unsignedFormData.append("upload_preset", uploadPreset);

    let cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: unsignedFormData,
      },
    );

    let data = await cloudinaryRes.json();

    // 2. If unsigned upload failed and we have credentials, try Signed Upload
    if (!cloudinaryRes.ok && apiKey && apiSecret) {
      console.warn(
        "Unsigned Cloudinary upload failed, attempting signed upload...",
        data.error?.message,
      );

      const timestamp = Math.round(new Date().getTime() / 1000).toString();
      const paramsToSign = `timestamp=${timestamp}${apiSecret}`;
      const signature = crypto
        .createHash("sha1")
        .update(paramsToSign)
        .digest("hex");

      const signedFormData = new FormData();
      signedFormData.append("file", fileData);
      signedFormData.append("timestamp", timestamp);
      signedFormData.append("api_key", apiKey);
      signedFormData.append("signature", signature);

      cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: signedFormData,
        },
      );

      data = await cloudinaryRes.json();
    }

    if (!cloudinaryRes.ok || !data.secure_url) {
      console.error("Cloudinary upload error:", data);
      return NextResponse.json(
        {
          error: data.error?.message || "Failed to upload image to Cloudinary",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
        format: data.format,
        width: data.width,
        height: data.height,
      },
      {
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
  } catch (err: any) {
    console.error("Image upload API exception:", err);
    return NextResponse.json(
      { error: err.message || "An error occurred while uploading image" },
      { status: 500 },
    );
  }
}
