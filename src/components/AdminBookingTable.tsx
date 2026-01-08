"use client";

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

export default function AdminBookingTable({
  bookings,
}: {
  bookings: BookingProps[];
}) {
  // State untuk loading saat tombol diklik (agar tidak diklik 2x)
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fungsi Konfirmasi
  const handleConfirm = async (bookingId: string, customerName: string) => {
    // 1. Tanya Admin dulu biar gak salah klik
    const isSure = confirm(
      `Konfirmasi booking dari ${
        customerName || "Tamu"
      }? \nNotifikasi WA akan dikirim otomatis.`
    );
    if (!isSure) return;

    // 2. Set loading
    setProcessingId(bookingId);

    // 3. Panggil Server Action - langsung ke CONFIRMED (SELESAI)
    await updateBookingStatus(bookingId, "CONFIRMED");

    // 4. Matikan loading (Data akan refresh otomatis karena revalidatePath di server)
    setProcessingId(null);
  };

  if (bookings.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Belum ada data booking.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <th className="py-4 px-6 text-left font-bold">Tanggal & Jam</th>
            <th className="py-4 px-6 text-left font-bold">Lapangan</th>
            <th className="py-4 px-6 text-left font-bold">Penyewa</th>
            <th className="py-4 px-6 text-left font-bold">Kontak</th>
            <th className="py-4 px-6 text-left font-bold">Harga</th>
            <th className="py-4 px-6 text-left font-bold">Status</th>
            <th className="py-4 px-6 text-center font-bold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bookings.map((booking, idx) => {
            const displayName =
              booking.customerName || booking.user?.name || "Guest";
            const displayContact =
              booking.customerPhone || booking.user?.email || "-";

            // Cek apakah booking sudah lunas/confirmed
            const isConfirmed =
              booking.status === "CONFIRMED" || booking.status === "LUNAS";

            return (
              <tr key={booking.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}>
                <td className="py-4 px-6">
                  <div className="font-semibold text-gray-900">
                    {format(new Date(booking.date), "dd MMM yyyy", {
                      locale: id,
                    })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {booking.startTime} - {booking.endTime}
                  </div>
                </td>
                <td className="py-4 px-6 font-medium text-gray-800">{booking.field.name}</td>
                <td className="py-4 px-6 font-semibold text-gray-900">{displayName}</td>
                <td className="py-4 px-6 text-gray-600">{displayContact}</td>
                <td className="py-4 px-6 font-bold text-blue-600">{formatRupiah(booking.totalPrice)}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block ${
                      booking.status === "CONFIRMED"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-amber-100 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {booking.status === "CONFIRMED" && "✓ Selesai"}
                    {booking.status === "PENDING" && "⏳ Pending"}
                  </span>
                </td>

                {/* KOLOM AKSI (TOMBOL STATUS) */}
                <td className="py-4 px-6 text-center">
                  {booking.status === "PENDING" ? (
                    <button
                      onClick={() => handleConfirm(booking.id, displayName)}
                      disabled={processingId === booking.id}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-all disabled:bg-gray-400 disabled:cursor-not-allowed hover:shadow-lg"
                    >
                      {processingId === booking.id
                        ? "Proses..."
                        : "✓ Selesai"}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs font-medium">Selesai</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
