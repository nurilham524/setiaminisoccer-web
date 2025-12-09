import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // Sesuaikan path

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 1. TERIMA DATA BARU (customerName, customerPhone)
    const { fieldId, date, startTime, price, customerName, customerPhone } = body;

    if (!fieldId || !date || !startTime || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Data tidak lengkap. Nama & WA wajib diisi." }, 
        { status: 400 }
      );
    }

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    // Cek Bentrok
    const existingBooking = await prisma.booking.findFirst({
      where: {
        fieldId,
        date: bookingDate,
        startTime: startTime,
        status: "CONFIRMED"
      }
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Jadwal ini sudah diambil orang lain!" },
        { status: 409 }
      );
    }

    const startHour = parseInt(startTime.split(":")[0]);
    const endTime = `${(startHour + 1).toString().padStart(2, "0")}:00`;

    // 2. SIMPAN KE DATABASE (Guest Mode)
    // Kita tidak perlu userId lagi karena kita punya customerName
    const newBooking = await prisma.booking.create({
      data: {
        fieldId,
        date: bookingDate,
        startTime,
        endTime,
        totalPrice: price,
        status: "CONFIRMED",
        // Simpan data tamu
        customerName: customerName,
        customerPhone: customerPhone,
      },
    });

    return NextResponse.json({ success: true, data: newBooking });

  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}