'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import cloudinary from '@/lib/cloudinary';

function extractCloudinaryPublicId(url: string) {
  try {
    const u = new URL(url);
    const idx = u.pathname.indexOf('/upload/');
    if (idx === -1) return null;
    let rest = u.pathname.substring(idx + '/upload/'.length);
    // remove version if present e.g. v123456789/
    rest = rest.replace(/^v\d+\//, '');
    // remove file extension
    rest = rest.replace(/\.[^/.]+$/, '');
    return rest.startsWith('/') ? rest.substring(1) : rest;
  } catch (e) {
    return null;
  }
}

export async function deletePromo(promoId: string) {
  try {
    const promo = await prisma.promo.findUnique({
      where: { id: promoId }
    });

    if (!promo) {
      return { success: false, error: 'Promo tidak ditemukan' };
    }

    if (promo.posterImage) {
      const publicId = extractCloudinaryPublicId(promo.posterImage);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        } catch (e) {
          // log and continue
          console.warn('Cloudinary delete failed:', e);
        }
      }
    }

    await prisma.promo.delete({
      where: { id: promoId }
    });

    revalidatePath('/admin');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Delete Error:', error);
    return { success: false, error: 'Gagal hapus promo' };
  }
}
