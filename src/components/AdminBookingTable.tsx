'use client'

import { useState } from "react"; // Tambah useState
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { updateBookingStatus } from "@/app/actions/updateBookingStatus"; // Import action yang baru dibuat

// Format Rupiah
const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

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
  // State untuk loading saat tombol diklik (agar tidak diklik 2x)
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fungsi Konfirmasi
  const handleConfirm = async (bookingId: string, customerName: string) => {
    // 1. Tanya Admin dulu biar gak salah klik
    const isSure = confirm(`Konfirmasi pembayaran dari ${customerName || 'Tamu'}? \nNotifikasi WA akan dikirim otomatis.`);
    if (!isSure) return;

    // 2. Set loading
    setProcessingId(bookingId);

    // 3. Panggil Server Action
    await updateBookingStatus(bookingId, "CONFIRMED");

    // 4. Matikan loading (Data akan refresh otomatis karena revalidatePath di server)
    setProcessingId(null);
  };

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
          <th className="py-3 px-4 text-center">Aksi</th> {/* Kolom Baru */}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {bookings.map((booking) => {
          const displayName = booking.customerName || booking.user?.name || "Guest";
          const displayContact = booking.customerPhone || booking.user?.email || "-";
          
          // Cek apakah booking sudah lunas/confirmed
          const isConfirmed = booking.status === 'CONFIRMED' || booking.status === 'LUNAS';

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
                  isConfirmed
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {booking.status}
                </span>
              </td>
              
              {/* KOLOM AKSI (TOMBOL KONFIRMASI) */}
              <td className="py-3 px-4 text-center">
                {!isConfirmed ? (
                    <button 
                        onClick={() => handleConfirm(booking.id, displayName)}
                        disabled={processingId === booking.id}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {processingId === booking.id ? "Proses..." : "✅ Confirm"}
                    </button>
                ) : (
                    <span className="text-gray-400 text-xs italic">Selesai</span>
                )}
              </td>

            </tr>
          );
        })}
      </tbody>
    </table>
  );
}