import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // Sesuaikan path (../../lib/prisma)

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Nomor HP wajib diisi" }, { status: 400 });
    }

    // Cari booking berdasarkan No HP (Case insensitive & Partial match logic opsional)
    // Di sini kita pakai Exact Match biar aman privacy-nya
    const bookings = await prisma.booking.findMany({
      where: {
        customerPhone: phone,
        status: { not: "CANCELLED" } // Opsional: kalau mau sembunyikan yang batal
      },
      include: {
        field: true // Kita butuh nama lapangan
      },
      orderBy: {
        date: 'desc' // Yang terbaru paling atas
      }
    });

    return NextResponse.json(bookings);

  } catch (error) {
    return NextResponse.json({ error: "Gagal mencari data" }, { status: 500 });
  }
}