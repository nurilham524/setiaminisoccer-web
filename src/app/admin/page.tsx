import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/LogoutButton";
import AdminBookingTable from "@/components/AdminBookingTable"; // Import file dari Langkah 2
import AdminSchedule from "@/components/AdminSchedule"; // Import file dari Langkah 4

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default async function AdminDashboard() {
  // 1. Ambil Data Terbaru untuk Tabel Riwayat
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 20, // Batasi 20 transaksi terakhir agar ringan
    include: { field: true, user: true },
  });

  // 2. Ambil Data Lapangan untuk dikirim ke Kalender
  const fields = await prisma.field.findMany();

  // 3. Hitung Statistik Pendapatan
  // Kita ambil SEMUA booking confirmed untuk hitung total duit
  const allConfirmedBookings = await prisma.booking.findMany({
    where: { OR: [{ status: "CONFIRMED" }, { status: "LUNAS" }] }
  });

  const totalRevenue = allConfirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  
  // Hitung jumlah booking pending
  const pendingCount = await prisma.booking.count({
    where: { status: "PENDING" }
  });

  // Hitung total booking lifetime
  const totalCount = await prisma.booking.count();

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white p-6 hidden md:flex flex-col justify-between sticky top-0 h-screen">
        <div>
            <h1 className="text-2xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 tracking-wider">
                ADMIN PANEL
            </h1>
            <nav className="space-y-3">
            <Link href="/admin" className="flex items-center gap-3 py-3 px-4 bg-gray-800 rounded-lg text-green-400 font-bold shadow-lg shadow-green-900/20">
                📊 Dashboard
            </Link>
            <Link href="/" className="flex items-center gap-3 py-3 px-4 hover:bg-gray-800 rounded-lg text-gray-400 transition hover:text-white">
                🌍 Website Utama
            </Link>
            </nav>
        </div>
        <div className="border-t border-gray-800 pt-6">
            <LogoutButton />
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Overview Bisnis</h2>
            <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border">
                Halo, Admin 👋
            </div>
        </header>

        {/* 1. KARTU STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Pendapatan */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Pendapatan</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{formatRupiah(totalRevenue)}</p>
            <div className="mt-4 h-1 w-full bg-green-100 rounded-full"><div className="h-1 bg-green-500 w-[70%] rounded-full"></div></div>
          </div>
          
          {/* Total Transaksi */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Booking</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{totalCount}</p>
          </div>

          {/* Menunggu Konfirmasi */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Perlu Konfirmasi</p>
            <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
                <span className="text-sm text-yellow-600 mb-1">pesanan</span>
            </div>
          </div>
        </div>

        {/* 2. JADWAL INTERAKTIF (FITUR BARU) */}
        <AdminSchedule fields={fields} />

        {/* 3. TABEL DATA TERBARU */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-800">Riwayat 20 Booking Terakhir</h3>
          </div>
          <div className="overflow-x-auto">
            <AdminBookingTable bookings={bookings} />
          </div>
        </div>
      </main>
    </div>
  );
}