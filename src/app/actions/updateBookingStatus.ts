'use server'

import { prisma } from "@/lib/prisma";
import { sendWhatsApp } from "@/utils/fonnte";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(bookingId: string, newStatus: string) {
  try {
    // 1. Update Database
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
      include: { field: true }
    });

    // 2. Kirim Notifikasi WA (Hanya jika status jadi CONFIRMED)
    if (newStatus === "CONFIRMED" || newStatus === "LUNAS") {
      const successMessage = `
✅ *PEMBAYARAN DITERIMA!*

Halo Kak ${booking.customerName}, booking Anda sudah *LUNAS/KONFIRMASI*.

🎫 *Tiket Masuk:*
ID Booking: ${booking.id.substring(0, 8)}...
Lapangan: ${booking.field.name}
Jam: ${booking.startTime}

Silakan tunjukkan pesan ini kepada petugas di lokasi.
Selamat bermain! ⚽🔥
      `.trim();

      // Pastikan ada nomor HP sebelum kirim
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