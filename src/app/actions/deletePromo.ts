'use server'

import { unlink } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deletePromo(promoId: string) {
  try {
    const promo = await prisma.promo.findUnique({
      where: { id: promoId }
    });

    if (!promo) {
      return { success: false, error: 'Promo tidak ditemukan' };
    }

    if (promo.posterImage) {
      const imagePath = join(process.cwd(), 'public', promo.posterImage);
      try {
        await unlink(imagePath);
      } catch (e) {
        // Skip
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
