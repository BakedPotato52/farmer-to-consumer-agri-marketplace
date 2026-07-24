import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      "kanak-acharya";
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
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
        return NextResponse.json({ error: "No file provided in form data" }, { status: 400 });
      }
      fileData = file as Blob;
    } else {
      const json = await request.json();
      if (!json.file) {
        return NextResponse.json({ error: "No file string provided in JSON payload" }, { status: 400 });
      }
      fileData = json.file;
    }

    // Build Cloudinary API payload
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", fileData);

    const timestamp = Math.round(new Date().getTime() / 1000).toString();

    if (apiKey && apiSecret) {
      // Signed upload to Cloudinary API
      const paramsToSign = `timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

      cloudinaryFormData.append("timestamp", timestamp);
      cloudinaryFormData.append("api_key", apiKey);
      cloudinaryFormData.append("signature", signature);
    } else {
      // Unsigned upload preset fallback
      cloudinaryFormData.append("upload_preset", uploadPreset);
    }

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      },
    );

    const data = await cloudinaryRes.json();

    if (!cloudinaryRes.ok || !data.secure_url) {
      console.error("Cloudinary upload failed:", data);
      return NextResponse.json(
        { error: data.error?.message || "Failed to upload image to Cloudinary" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height,
    });
  } catch (err: any) {
    console.error("Image upload API error:", err);
    return NextResponse.json(
      { error: err.message || "An error occurred while uploading image" },
      { status: 500 },
    );
  }
}
