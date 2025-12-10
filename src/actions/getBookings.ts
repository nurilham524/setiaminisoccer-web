'use server'

import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function getBookingsByDate(date: Date) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        // PERBAIKAN PENTING:
        // Filter berdasarkan kolom 'date' (DateTime), bukan 'startTime' (String)
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
      include: {
        field: true, // Ambil data lapangan
        user: {      
            // Ambil data user registered (jika ada)
            select: { 
                name: true, 
                email: true // Ganti phone dengan email
            } 
        } 
      },
      orderBy: {
        // Karena startTime string ("08:00", "09:00"), sorting asc tetap aman
        startTime: 'asc', 
      },
    });

    return { success: true, data: bookings };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return { success: false, error: "Gagal mengambil data booking." };
  }
}