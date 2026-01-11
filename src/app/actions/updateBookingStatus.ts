'use server'

import { prisma } from "@/lib/prisma";
import { sendWhatsApp } from "@/utils/fonnte";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(bookingId: string, newStatus: string) {
  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
      include: { field: true }
    });

    if (newStatus === "CONFIRMED") {
      const successMessage = `
✅ *PEMBAYARAN DITERIMA!*

Halo Kak ${booking.customerName}, booking Anda sudah terkonfirmasi.

🎫 *Tiket Masuk:*
ID Booking: ${booking.id.substring(0, 8)}...
Tanggal: ${new Date(booking.date).toLocaleDateString('id-ID')}
Jam: ${booking.startTime} - ${booking.endTime}
Harga: Rp ${booking.totalPrice?.toLocaleString('id-ID')}

Silakan tunjukkan pesan ini kepada petugas di lokasi.
Selamat bermain! ⚽🔥
      `.trim();

      if (booking.customerPhone) {
        await sendWhatsApp(booking.customerPhone, successMessage);
      }
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "Gagal update status" };
  }
}