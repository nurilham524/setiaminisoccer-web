"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Swal from "sweetalert2";
import { updateBookingStatus } from "@/app/actions/updateBookingStatus";
import { rescheduleBooking } from "@/app/actions/rescheduleBooking";
import { cancelBooking } from "@/app/actions/cancelBooking";

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
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rescheduleModal, setRescheduleModal] = useState<{
    open: boolean;
    bookingId: string;
    currentDate: string;
    currentStartTime: string;
    currentEndTime: string;
    customerName: string;
  } | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const handleConfirm = async (bookingId: string, customerName: string) => {
    const isSure = confirm(
      `Konfirmasi booking dari ${
        customerName || "Tamu"
      }? \nNotifikasi WA akan dikirim otomatis.`
    );
    if (!isSure) return;

    setProcessingId(bookingId);
    await updateBookingStatus(bookingId, "CONFIRMED");
    setProcessingId(null);
  };

  const handleReschedule = (booking: BookingProps) => {
    const bookingDate = format(new Date(booking.date), "yyyy-MM-dd");
    setRescheduleModal({
      open: true,
      bookingId: booking.id,
      currentDate: bookingDate,
      currentStartTime: booking.startTime,
      currentEndTime: booking.endTime,
      customerName: booking.customerName || booking.user?.name || "Guest",
    });
    setRescheduleForm({
      date: bookingDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
    });
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleModal || !rescheduleForm.date || !rescheduleForm.startTime || !rescheduleForm.endTime) {
      Swal.fire("Error", "Silakan isi semua field", "error");
      return;
    }

    setProcessingId(rescheduleModal.bookingId);
    try {
      const result = await rescheduleBooking(
        rescheduleModal.bookingId,
        rescheduleForm.date,
        rescheduleForm.startTime,
        rescheduleForm.endTime
      );

      if (result && 'success' in result && result.success) {
        Swal.fire("Sukses", "Jadwal booking berhasil diubah", "success");
        setRescheduleModal(null);
      } else {
        const errorMsg = result && 'error' in result ? result.error : "Gagal mengubah jadwal";
        Swal.fire("Error", errorMsg as string, "error");
      }
    } catch {
      Swal.fire("Error", "Terjadi kesalahan", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (bookingId: string, customerName: string) => {
    const result = await Swal.fire({
      title: "Batalkan Booking?",
      text: `Batalkan booking dari ${customerName}? Notifikasi WA akan dikirim.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Batalkan",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      setProcessingId(bookingId);
      try {
        const cancelResult = await cancelBooking(bookingId, "Admin membatalkan booking");
        
        if (cancelResult && 'success' in cancelResult && cancelResult.success) {
          Swal.fire("Sukses", "Booking berhasil dibatalkan", "success");
        } else {
          const errorMsg = cancelResult && 'error' in cancelResult ? cancelResult.error : "Gagal membatalkan booking";
          Swal.fire("Error", errorMsg as string, "error");
        }
      } catch {
        Swal.fire("Error", "Terjadi kesalahan", "error");
      } finally {
        setProcessingId(null);
      }
    }
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
          <tr className="bg-linear-to-r from-gray-900 to-gray-800 text-white">
            <th className="py-4 px-6 text-left font-bold">Tanggal & Jam</th>
            {/* <th className="py-4 px-6 text-left font-bold">Lapangan</th> */}
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
                {/* <td className="py-4 px-6 font-medium text-gray-800">{booking.field.name}</td> */}
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
                  <div className="flex gap-2 justify-center flex-wrap">
                    {booking.status === "PENDING" && (
                      <button
                        onClick={() => handleConfirm(booking.id, displayName)}
                        disabled={processingId === booking.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-md transition-all disabled:bg-gray-400 disabled:cursor-not-allowed hover:shadow-lg"
                      >
                        {processingId === booking.id ? "..." : "✓ Selesai"}
                      </button>
                    )}
                    <button
                      onClick={() => handleReschedule(booking)}
                      disabled={processingId === booking.id}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-md transition-all disabled:bg-gray-400 disabled:cursor-not-allowed hover:shadow-lg"
                    >
                      📅 Ubah
                    </button>
                    <button
                      onClick={() => handleCancel(booking.id, displayName)}
                      disabled={processingId === booking.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-md transition-all disabled:bg-gray-400 disabled:cursor-not-allowed hover:shadow-lg"
                    >
                      ✕ Batalkan
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* RESCHEDULE MODAL */}
      {rescheduleModal?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-fadeIn relative">
            <button
            onClick={() => setRescheduleModal(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          </button>

          <h3 className="text-lg font-bold text-gray-800 mb-4">
            📅 Ubah Jadwal Booking
          </h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Penyewa
              </label>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {rescheduleModal.customerName}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal Baru
              </label>
              <input
                type="date"
                value={rescheduleForm.date}
                onChange={(e) =>
                  setRescheduleForm({ ...rescheduleForm, date: e.target.value })
                }
                className="w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jam Mulai
                </label>
                <input
                  type="time"
                  value={rescheduleForm.startTime}
                  onChange={(e) =>
                    setRescheduleForm({ ...rescheduleForm, startTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jam Selesai
                </label>
                <input
                  type="time"
                  value={rescheduleForm.endTime}
                  onChange={(e) =>
                    setRescheduleForm({ ...rescheduleForm, endTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-6">
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Jadwal Lama:</span> <br/>
              {rescheduleModal.currentDate} ({rescheduleModal.currentStartTime} - {rescheduleModal.currentEndTime})
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setRescheduleModal(null)}
              disabled={processingId === rescheduleModal.bookingId}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleRescheduleSubmit}
              disabled={processingId === rescheduleModal.bookingId}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:bg-gray-400"
            >
              {processingId === rescheduleModal.bookingId ? "Proses..." : "Ubah Jadwal"}
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
