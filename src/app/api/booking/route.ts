import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { sendWhatsApp } from "@/utils/fonnte";

const ADMIN_PHONE = "085656804903";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fieldId,
      date,
      startTime,
      endTime,
      price,
      customerName,
      customerPhone,
      status = "PENDING",
    } = body;

    if (
      !fieldId ||
      !date ||
      !startTime ||
      !endTime ||
      !customerName ||
      !customerPhone
    ) {
      return NextResponse.json(
        { error: "Data tidak lengkap. Nama & WA wajib diisi." },
        { status: 400 }
      );
    }

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    const existingBooking = await prisma.booking.findFirst({
      where: {
        fieldId,
        date: bookingDate,
        startTime: startTime,
        status: {
          in: ["CONFIRMED", "LUNAS"],
        },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Jadwal ini sudah diambil orang lain!" },
        { status: 409 }
      );
    }

    const newBooking = await prisma.booking.create({
      data: {
        fieldId,
        date: bookingDate,
        startTime,
        endTime,
        totalPrice: price,
        status: status,
        customerName: customerName,
        customerPhone: customerPhone,
      },
    });

    // Kirim notifikasi WA ke pelanggan
    const userMessage = `
Halo Kak *${customerName}*! 👋
Booking Anda berhasil dicatat (Sedang Diproses).

⚽ *Detail Booking:*
Tanggal: ${bookingDate.toLocaleDateString("id-ID")}
Jam: ${startTime} - ${endTime}
Total: *Rp ${price?.toLocaleString("id-ID") || "-"}*
    `.trim();

    await sendWhatsApp(customerPhone, userMessage);

    // Kirim notifikasi WA ke admin
    const adminMessage = `
🔔 *BOOKING BARU MASUK!*

Pelanggan: ${customerName}
WA: ${customerPhone}
Jadwal: ${bookingDate.toLocaleDateString("id-ID")} (${startTime} - ${endTime})
Total: Rp ${price?.toLocaleString("id-ID") || "-"}
Status: Menunggu Verifikasi

Segera cek dashboard admin!
    `.trim();

    await sendWhatsApp(ADMIN_PHONE, adminMessage);

    return NextResponse.json({ success: true, data: newBooking });
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
