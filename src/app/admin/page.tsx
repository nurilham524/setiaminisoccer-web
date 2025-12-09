import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/LogoutButton";
import AdminBookingTable from "@/components/AdminBookingTable";

// Fungsi untuk format uang (Rupiah)
const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Fungsi untuk format tanggal (Contoh: Senin, 09 Des 2025)
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default async function AdminDashboard() {
  // 1. Fetch Data Utama
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" }, // Yang terbaru paling atas
    include: {
      field: true, // Ambil data nama lapangan
      user: true,  // Ambil data nama user
    },
  });

  const fields = await prisma.field.findMany();

  // 2. Hitung Statistik (Business Intelligence Sederhana)
const calculateBookingTotal = (b: any) => {
    // 1. Prioritaskan harga yang tersimpan di database (Historical Data)
    if (b.totalPrice && b.totalPrice > 0) {
        return b.totalPrice;
    }

    // 2. Jika database kosong, baru hitung manual (Fallback)
    const startParts = b.startTime?.split(":").map(Number) ?? [0];
    const endParts = b.endTime?.split(":").map(Number) ?? [0];
    // ... (sisa logika Anda sama)
};

  const totalRevenue = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + calculateBookingTotal(b), 0);
  
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;

  // 3. Logika Visualisasi Jadwal Kosong (Hari Ini)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter booking KHUSUS hari ini & Confirmed
  const todaysBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.date);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate.getTime() === today.getTime() && b.status === "CONFIRMED";
  });

  // Jam Operasional (08:00 - 22:00)
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", 
    "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR SEDERHANA */}
      <aside className="w-64 bg-gray-900 text-white p-6 hidden md:flex flex-col justify-between">
        <div>
            <h1 className="text-2xl font-bold mb-8 text-green-400 tracking-wider">ADMIN PANEL</h1>
            <nav className="space-y-4">
            <Link href="/admin" className="block py-2 px-4 bg-gray-800 rounded text-green-400 font-bold">
                Dashboard
            </Link>
            <Link href="/" className="block py-2 px-4 hover:bg-gray-800 rounded text-gray-400 transition">
                Lihat Website Utama
            </Link>
            </nav>
        </div>

        {/* TOMBOL LOGOUT (Dipasang Disini) */}
        <div className="mt-8 border-t border-gray-800 pt-4">
            <LogoutButton />
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Ringkasan</h2>

        {/* 1. STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card Pendapatan */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <p className="text-gray-500 text-sm font-medium">Total Pendapatan</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{formatRupiah(totalRevenue)}</p>
          </div>
          {/* Card Total Booking */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm font-medium">Total Booking</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{totalBookings} <span className="text-base font-normal text-gray-400">pesanan</span></p>
          </div>
          {/* Card Pending */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm font-medium">Perlu Konfirmasi</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{pendingBookings} <span className="text-base font-normal text-gray-400">pesanan</span></p>
          </div>
        </div>

        {/* 2. LIVE AVAILABILITY (JADWAL KOSONG HARI INI) */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Status Lapangan Hari Ini ({formatDate(today)})</h3>
                <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-2"><div className="w-3 h-3 bg-green-100 border border-green-500 rounded"></div> Kosong</span>
                    <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded"></div> Terisi</span>
                </div>
            </div>

            <div className="space-y-6">
                {fields.map(field => (
                    <div key={field.id}>
                        <h4 className="font-semibold text-gray-700 mb-2">{field.name} ({field.type})</h4>
                        <div className="grid grid-cols-8 md:grid-cols-15 gap-2">
                            {timeSlots.map(time => {
                                // Cek apakah jam ini ada di booking hari ini
                                const isBooked = todaysBookings.some(
                                    b => b.fieldId === field.id && b.startTime === time
                                );
                                
                                return (
                                    <div 
                                        key={time}
                                        className={`
                                            text-xs py-2 rounded text-center font-medium border
                                            ${isBooked 
                                                ? 'bg-red-500 text-white border-red-600' 
                                                : 'bg-green-50 text-green-700 border-green-200'}
                                        `}
                                    >
                                        {time}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 3. TABEL DATA BOOKING */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-800">Riwayat Booking Terbaru</h3>
          </div>
          <div className="overflow-x-auto">
            <AdminBookingTable bookings={bookings} />
          </div>
        </div>
      </main>
    </div>
  );
}