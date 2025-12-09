import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // Sesuaikan path jika perlu (../../lib/prisma)

// 1. UPDATE STATUS (PATCH)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Support Next.js 15
) {
  try {
    const { id } = await params;
    const { status } = await request.json(); // Menerima status baru (misal: "CONFIRMED")

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}

// 2. HAPUS BOOKING (DELETE)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal hapus" }, { status: 500 });
  }
}