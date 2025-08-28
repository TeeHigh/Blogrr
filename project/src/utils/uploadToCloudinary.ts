import { CloudinaryUploadResponse } from "../types/types";


export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_preset");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  const data = await res.json();
  console.log(data)
  return data;
}

export async function deleteFromCloudinary(public_id: string): Promise<void> {
  const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/destroy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      public_id
      // No api_key needed for unsigned uploads
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to delete image from Cloudinary");
  }

  const data = await res.json();
  if (data.result !== "ok") {
    throw new Error("Failed to delete image: " + data.message);
  }
}

