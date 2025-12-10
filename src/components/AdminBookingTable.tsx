'use client'

import { format } from "date-fns";
import { id } from "date-fns/locale";

// Format Rupiah
const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Sesuaikan tipe data dengan apa yang dikirim dari Prisma
type BookingProps = {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  field: { name: string };
  user?: { name: string; email: string } | null;
  customerName?: string | null;
  customerPhone?: string | null;
  status: string;
  totalPrice: number;
};

export default function AdminBookingTable({ bookings }: { bookings: BookingProps[] }) {
  if (bookings.length === 0) {
    return <div className="p-6 text-center text-gray-500">Belum ada data booking.</div>;
  }

  return (
    <table className="min-w-full text-sm text-left">
      <thead className="bg-gray-50 text-gray-600 font-medium border-b">
        <tr>
          <th className="py-3 px-4">Tanggal & Jam</th>
          <th className="py-3 px-4">Lapangan</th>
          <th className="py-3 px-4">Penyewa</th>
          <th className="py-3 px-4">Kontak</th>
          <th className="py-3 px-4">Harga</th>
          <th className="py-3 px-4">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {bookings.map((booking) => {
          // Logika Prioritas Nama: Tamu > Member > Unknown
          const displayName = booking.customerName || booking.user?.name || "Guest";
          // Logika Prioritas Kontak: WA Tamu > Email Member
          const displayContact = booking.customerPhone || booking.user?.email || "-";

          return (
            <tr key={booking.id} className="hover:bg-gray-50 transition">
              <td className="py-3 px-4">
                <div className="font-bold text-gray-800">
                  {format(new Date(booking.date), 'dd MMM yyyy', { locale: id })}
                </div>
                <div className="text-xs text-gray-500">
                  {booking.startTime} - {booking.endTime}
                </div>
              </td>
              <td className="py-3 px-4">{booking.field.name}</td>
              <td className="py-3 px-4 font-medium">{displayName}</td>
              <td className="py-3 px-4 text-gray-500">{displayContact}</td>
              <td className="py-3 px-4">{formatRupiah(booking.totalPrice)}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  booking.status === 'CONFIRMED' || booking.status === 'LUNAS'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {booking.status}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}