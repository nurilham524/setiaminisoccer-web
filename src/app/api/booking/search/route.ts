import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Nomor HP wajib diisi" }, { status: 400 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        customerPhone: phone,
        status: { not: "CANCELLED" } 
      },
      include: {
        field: true 
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(bookings);

  } catch (error) {
    return NextResponse.json({ error: "Gagal mencari data" }, { status: 500 });
  }
}