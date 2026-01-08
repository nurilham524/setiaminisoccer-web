'use server'

import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, subHours, addHours } from "date-fns";

export async function getBookingsByDate(date: Date) {
  try {
    const start = subHours(startOfDay(date), 7);
    const end = addHours(endOfDay(date), 7);

    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      select: {
        fieldId: true,
        startTime: true,
        endTime: true,
        status: true,
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