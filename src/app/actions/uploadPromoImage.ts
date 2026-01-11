'use server'

import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function uploadPromoImage(
  promoId: string,
  fileBase64: string,
  fileName: string
) {
  try {
    const promo = await prisma.promo.findUnique({
      where: { id: promoId }
    });

    if (!promo) {
      return { success: false, error: 'Promo tidak ditemukan' };
    }

    if (promo.posterImage) {
      const oldImagePath = join(process.cwd(), 'public', promo.posterImage);
      try {
        await unlink(oldImagePath);
      } catch (e) {
        // Skip if file doesn't exist 
      }
    }

    const timestamp = Date.now();
    const ext = fileName.split('.').pop();
    const newFileName = `promo-${promoId}-${timestamp}.${ext}`;
    const filePath = join(process.cwd(), 'public', 'promos', newFileName);
    const buffer = Buffer.from(fileBase64, 'base64');
    await writeFile(filePath, buffer);
    const imagePath = `/promos/${newFileName}`;
    const updatedPromo = await prisma.promo.update({
      where: { id: promoId },
      data: { posterImage: imagePath }
    });

    revalidatePath('/admin');
    revalidatePath('/');

    return { 
      success: true, 
      promo: updatedPromo,
      imagePath 
    };
  } catch (error) {
    console.error('Upload Error:', error);
    return { success: false, error: 'Gagal upload gambar' };
  }
}
