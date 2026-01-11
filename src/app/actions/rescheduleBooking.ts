'use server'

import { prisma } from "@/lib/prisma";
import { sendWhatsApp } from "@/utils/fonnte";
import { revalidatePath } from "next/cache";

export async function rescheduleBooking(
  bookingId: string,
  newDate: string,
  newStartTime: string,
  newEndTime: string
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { field: true }
    });

    if (!booking) {
      return { success: false, error: "Booking tidak ditemukan" };
    }

    const bookingDate = new Date(newDate);
    bookingDate.setHours(0, 0, 0, 0);
    
    const conflict = await prisma.booking.findFirst({
      where: {
        fieldId: booking.fieldId,
        date: bookingDate,
        startTime: newStartTime,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        id: { not: bookingId },
      },
    });

    if (conflict) {
      return { success: false, error: "Jadwal baru sudah terpakai" };
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        date: bookingDate,
        startTime: newStartTime,
        endTime: newEndTime,
      },
      include: { field: true }
    });

    if (booking.customerPhone) {
      const oldDate = new Date(booking.date).toLocaleDateString('id-ID');
      const newDateFormatted = bookingDate.toLocaleDateString('id-ID');
      
      const message = `
📅 *JADWAL BOOKING DIUBAH*

Halo Kak ${booking.customerName},

Jadwal booking Anda telah diubah oleh admin.

❌ *Jadwal Lama:*
${oldDate} (${booking.startTime} - ${booking.endTime})

✅ *Jadwal Baru:*
${newDateFormatted} (${newStartTime} - ${newEndTime})
Harga: Rp ${booking.totalPrice?.toLocaleString('id-ID')}

Silakan konfirmasi atau hubungi admin jika ada pertanyaan.
      `.trim();

      await sendWhatsApp(booking.customerPhone, message);
    }

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, booking: updatedBooking };
  } catch (error) {
    console.error("Reschedule Error:", error);
    return { success: false, error: "Gagal mengubah jadwal" };
  }
}
