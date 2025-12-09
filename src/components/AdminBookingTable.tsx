'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

// Definisi tipe data biar TypeScript senang
type BookingData = {
  id: string;
  customerName: string | null;
  customerPhone: string | null;
  date: Date;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  field: { name: string };
  user: { name: string | null; email: string } | null;
};

// Fungsi format (Copy dari yang lama)
const formatRupiah = (num: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
const formatDate = (date: Date | string) => new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(date));

export default function AdminBookingTable({ bookings }: { bookings: BookingData[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState("");

  // Fungsi Ganti Status
  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!confirm(`Ubah status jadi ${newStatus}?`)) return;
    setIsLoading(id);

    try {
      await fetch(`/api/booking/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh(); // Refresh data tanpa reload page
    } catch (error) {
      alert("Gagal update");
    } finally {
      setIsLoading("");
    }
  };

  // Fungsi Hapus
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus data ini selamanya?")) return;
    setIsLoading(id);

    try {
      await fetch(`/api/booking/${id}`, { method: "DELETE" });
      router.refresh();
    } catch (error) {
      alert("Gagal hapus");
    } finally {
      setIsLoading("");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-gray-800 font-bold uppercase text-xs">
          <tr>
            <th className="px-6 py-3">Customer</th>
            <th className="px-6 py-3">Jadwal</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 font-medium text-gray-900">
                {booking.customerName || booking.user?.name || "Guest"}
                <div className="text-xs text-gray-500 font-normal">
                    {booking.customerPhone || booking.user?.email || "-"}
                </div>
                <div className="text-xs text-gray-400 mt-1">{booking.field.name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="font-bold text-gray-700">{formatDate(booking.date)}</div>
                <div className="font-mono text-xs">{booking.startTime} - {booking.endTime}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                  booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                {/* Tombol Aksi */}
                {isLoading === booking.id ? (
                  <span className="text-xs text-gray-400">Proses...</span>
                ) : (
                  <>
                    {booking.status !== "CONFIRMED" && (
                        <button 
                            onClick={() => handleStatusChange(booking.id, "CONFIRMED")}
                            className="text-green-600 hover:text-green-800 text-xs font-bold border border-green-200 px-2 py-1 rounded bg-green-50"
                        >
                            ✔ TERIMA
                        </button>
                    )}
                    
                    {booking.status !== "CANCELLED" && (
                        <button 
                            onClick={() => handleStatusChange(booking.id, "CANCELLED")}
                            className="text-orange-600 hover:text-orange-800 text-xs font-bold border border-orange-200 px-2 py-1 rounded bg-orange-50"
                        >
                            ✖ BATAL
                        </button>
                    )}

                    <button 
                        onClick={() => handleDelete(booking.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-bold px-2 py-1"
                        title="Hapus Permanen"
                    >
                        🗑️
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}