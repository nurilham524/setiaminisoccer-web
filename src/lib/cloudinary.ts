import { v2 as cloudinaryV2, UploadApiResponse } from "cloudinary";

cloudinaryV2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(file: Buffer | Blob | File | string, folder = "setia-minisoccer") {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinaryV2.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      if (!result) return reject(new Error("No result from Cloudinary"));
      resolve(result as UploadApiResponse);
    });

    // If it's a base64 string data URL, strip prefix
    if (typeof file === "string") {
      const base64 = file.includes(",") ? file.split(",")[1] : file;
      const buffer = Buffer.from(base64, "base64");
      stream.end(buffer);
      return;
    }

    // Browser File/Blob
    if (typeof (file as any)?.arrayBuffer === "function") {
      (file as any).arrayBuffer()
        .then((ab: ArrayBuffer) => stream.end(Buffer.from(ab)))
        .catch(reject);
      return;
    }

    // Buffer
    if (Buffer.isBuffer(file)) {
      stream.end(file as Buffer);
      return;
    }

    reject(new Error("Unsupported file type for uploadToCloudinary"));
  });
}

export default cloudinaryV2;
