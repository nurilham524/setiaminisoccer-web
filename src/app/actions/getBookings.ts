'use server'

import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, subHours, addHours } from "date-fns"; // Tambah import ini

export async function getBookingsByDate(date: Date) {
  try {
    // KOREKSI ZONA WAKTU (FIX WIB)
    // Server Vercel (UTC) seringkali "telat" membaca tanggal WIB.
    // Kita perlu meluaskan pencarian:
    // Mulai dari 7 jam SEBELUM jam 00:00 UTC (untuk menangkap jam 00:00 WIB)
    // Sampai 7 jam SETELAH jam 23:59 UTC (agar aman)
    
    const start = subHours(startOfDay(date), 7);
    const end = addHours(endOfDay(date), 7);

    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        field: true, 
        user: {      
            select: { name: true, email: true } 
        } 
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return { success: true, data: bookings };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return { success: false, error: "Gagal mengambil data." };
  }
}