'use client'

import { useState } from "react";
import Link from "next/link";

const formatDate = (date: string) => new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(new Date(date));
const formatRupiah = (num: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

export default function CheckBookingPage() {
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return alert("Isi nomor WA dulu!");
    
    setLoading(true);
    setBookings([]);
    setHasSearched(false);

    try {
      const res = await fetch("/api/booking/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      setBookings(data);
      setHasSearched(true);
    } catch (error) {
      alert("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Cek Pesanan Saya</h1>
            <p className="text-gray-500 mt-2">Masukkan nomor WhatsApp yang Anda gunakan saat booking.</p>
            <div className="mt-4">
                <Link href="/" className="text-blue-600 hover:underline text-sm">&larr; Kembali ke Home</Link>
            </div>
        </div>

        {/* Form Pencarian */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <form onSubmit={handleSearch} className="flex gap-4">
                <input 
                    type="tel" 
                    placeholder="Contoh: 08123456789"
                    className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <button 
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading ? "Mencari..." : "Cari"}
                </button>
            </form>
        </div>

        {/* Hasil Pencarian */}
        {hasSearched && (
            <div className="space-y-4">
                {bookings.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">Tidak ditemukan booking dengan nomor tersebut.</p>
                        <p className="text-sm text-gray-400">Pastikan nomor WA sama persis saat mendaftar.</p>
                    </div>
                ) : (
                    bookings.map((booking) => (
                        <div key={booking.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{booking.field.name}</h3>
                                    <p className="text-gray-600">{formatDate(booking.date)}</p>
                                    <div className="mt-2 inline-block px-3 py-1 bg-gray-100 rounded text-sm font-mono text-gray-800">
                                        Jam: {booking.startTime} - {booking.endTime}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {booking.status}
                                    </span>
                                    <p className="mt-2 font-bold text-green-600">{formatRupiah(booking.totalPrice)}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}
      </div>
    </main>
  );
}