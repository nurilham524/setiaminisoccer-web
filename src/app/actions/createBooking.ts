'use server'

import { prisma } from "@/lib/prisma";
import { sendWhatsApp } from "@/utils/fonnte"; // Import fungsi tadi
import { revalidatePath } from "next/cache";

// Ganti nomor ini dengan nomor Admin/Owner Lapangan
const ADMIN_PHONE = "08123456789"; 

export async function createBooking(formData: FormData) {
  // 1. Ambil data dari form
  const fieldId = formData.get("fieldId") as string;
  const date = new Date(formData.get("date") as string);
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const customerName = formData.get("customerName") as string;
  const customerPhone = formData.get("customerPhone") as string;
  const totalPrice = Number(formData.get("price"));

  // 2. Simpan ke Database
  const newBooking = await prisma.booking.create({
    data: {
      fieldId,
      date,
      startTime,
      endTime,
      customerName,
      customerPhone,
      totalPrice,
      status: "PENDING", // Status awal
    },
    include: { field: true } // Ambil nama lapangan
  });

  // --- LOGIKA NOTIFIKASI WA (BARU) ---

  // A. Kirim WA ke CUSTOMER (Tagihan)
  const userMessage = `
Halo Kak *${customerName}*! 👋
Booking Anda berhasil dicatat (Menunggu Pembayaran).

⚽ *Detail Booking:*
Lapangan: ${newBooking.field.name}
Tanggal: ${date.toLocaleDateString('id-ID')}
Jam: ${startTime} - ${endTime}
Total: *Rp ${totalPrice.toLocaleString('id-ID')}*

💳 *Silakan Transfer ke:*
BCA: 1234567890 (a.n Sport Center)
Sejumlah: Rp ${totalPrice.toLocaleString('id-ID')}

*PENTING:*
Balas pesan ini dengan mengirimkan BUKTI TRANSFER agar status booking menjadi CONFIRMED.
  `.trim();

  await sendWhatsApp(customerPhone, userMessage);

  // B. Kirim WA ke ADMIN (Laporan Order Baru)
  const adminMessage = `
🔔 *BOOKING BARU MASUK!*

Pelanggan: ${customerName}
WA: ${customerPhone}
Jadwal: ${date.toLocaleDateString('id-ID')} (${startTime})
Lapangan: ${newBooking.field.name}
Status: Menunggu Konfirmasi

Segera cek dashboard admin!
  `.trim();

  await sendWhatsApp(ADMIN_PHONE, adminMessage);

  // -----------------------------------

  revalidatePath("/admin"); // Refresh data admin
  return { success: true, bookingId: newBooking.id };
}