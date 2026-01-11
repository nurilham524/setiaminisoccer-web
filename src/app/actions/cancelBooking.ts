'use server'

import { prisma } from "@/lib/prisma";
import { sendWhatsApp } from "@/utils/fonnte";
import { revalidatePath } from "next/cache";

export async function cancelBooking(
  bookingId: string,
  reason: string = "Admin membatalkan booking"
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { field: true }
    });

    if (!booking) {
      return { success: false, error: "Booking tidak ditemukan" };
    }
    await prisma.booking.delete({
      where: { id: bookingId }
    });
    if (booking.customerPhone) {
      const bookingDate = new Date(booking.date).toLocaleDateString('id-ID');
      
      const message = `
❌ *BOOKING DIBATALKAN*

Halo Kak ${booking.customerName},

Booking Anda telah dibatalkan oleh admin.

📋 *Detail Booking Yang Dibatalkan:*
Tanggal: ${bookingDate}
Jam: ${booking.startTime} - ${booking.endTime}
Harga: Rp ${booking.totalPrice?.toLocaleString('id-ID')}

Alasan: ${reason}

Hubungi admin jika ingin melakukan booking ulang.
      `.trim();

      await sendWhatsApp(booking.customerPhone, message);
    }

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Cancel Error:", error);
    return { success: false, error: "Gagal membatalkan booking" };
  }
}
