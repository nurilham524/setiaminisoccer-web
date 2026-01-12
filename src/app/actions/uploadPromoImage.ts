"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function uploadPromoImage(
  promoId: string,
  fileBase64: string,
  fileName: string
) {
  try {
    const promo = await prisma.promo.findUnique({
      where: { id: promoId },
    });

    if (!promo) {
      return { success: false, error: "Promo tidak ditemukan" };
    }

    // Convert base64 string to Buffer
    const buffer = Buffer.from(fileBase64, "base64");

    // Upload to Cloudinary under folder 'promo-banner'
    const uploadResult = await uploadToCloudinary(buffer, "promo-banner");

    if (!uploadResult || !uploadResult.secure_url) {
      return { success: false, error: "Gagal upload gambar ke Cloudinary" };
    }

    const imageUrl = uploadResult.secure_url;

    const updatedPromo = await prisma.promo.update({
      where: { id: promoId },
      data: { posterImage: imageUrl },
    });

    revalidatePath("/admin");
    revalidatePath("/");

    return {
      success: true,
      promo: updatedPromo,
      imageUrl,
    };
  } catch (error) {
    console.error("Upload Error:", error);
    return { success: false, error: "Gagal upload gambar" };
  }
}
