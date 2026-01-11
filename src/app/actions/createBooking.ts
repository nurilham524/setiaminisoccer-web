"use server";

import { prisma } from "@/lib/prisma";
import { sendWhatsApp } from "@/utils/fonnte";
import { revalidatePath } from "next/cache";

const ADMIN_PHONE = "085656804903";

export async function createBooking(formData: FormData) {
  const fieldId = formData.get("fieldId") as string;
  const date = new Date(formData.get("date") as string);
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const customerName = formData.get("customerName") as string;
  const customerPhone = formData.get("customerPhone") as string;
  const totalPrice = Number(formData.get("price"));

  const newBooking = await prisma.booking.create({
    data: {
      fieldId,
      date,
      startTime,
      endTime,
      customerName,
      customerPhone,
      totalPrice,
      status: "PENDING",
    },
    include: { field: true },
  });

  const userMessage = `
Halo Kak *${customerName}*! 👋
Booking Anda berhasil dicatat (Menunggu Pembayaran).

⚽ *Detail Booking:*
Tanggal: ${date.toLocaleDateString("id-ID")}
Jam: ${startTime} - ${endTime}
Total: *Rp ${totalPrice.toLocaleString("id-ID")}*

💳 *Silakan Transfer ke:*
BCA: 1234567890 (a.n Sport Center)
Sejumlah: Rp ${totalPrice.toLocaleString("id-ID")}

*PENTING:*
Balas pesan ini dengan mengirimkan BUKTI TRANSFER agar status booking menjadi CONFIRMED.
  `.trim();

  await sendWhatsApp(customerPhone, userMessage);

  const adminMessage = `
🔔 *BOOKING BARU MASUK!*

Pelanggan: ${customerName}
WA: ${customerPhone}
Jadwal: ${date.toLocaleDateString("id-ID")} (${startTime} - ${endTime})
Total: Rp ${totalPrice.toLocaleString("id-ID")}
Status: Menunggu Verifikasi

Segera cek dashboard admin!
  `.trim();

  await sendWhatsApp(ADMIN_PHONE, adminMessage);

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, bookingId: newBooking.id };
}
