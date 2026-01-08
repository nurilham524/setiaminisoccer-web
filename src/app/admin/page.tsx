import { prisma } from "@/lib/prisma";
import AdminBookingTable from "@/components/AdminBookingTable";
import AdminSchedule from "@/components/JadwalAdmin";
import PromoManager from "@/components/PromoManager";

// Pastikan halaman ini selalu merender data terbaru (Real-time)
export const dynamic = 'force-dynamic';

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default async function AdminDashboard() {
  // 1. Ambil Data Terbaru untuk Tabel Riwayat (Limit 20)
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 20, 
    include: { 
      field: true, 
      user: {
        select: { name: true, email: true }
      }
    },
  });

  // 2. Ambil Data Lapangan untuk Kalender
  const fields = await prisma.field.findMany();

  // 3. Hitung Statistik Pendapatan
  const allConfirmedBookings = await prisma.booking.findMany({
    where: { status: "CONFIRMED" }
  });

  const totalRevenue = allConfirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  
  // Hitung jumlah booking pending
  const pendingCount = await prisma.booking.count({
    where: { status: "PENDING" }
  });

  // Hitung total booking lifetime
  const totalCount = await prisma.booking.count();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-500 mt-1">Pantau performa bisnis dan jadwal lapangan hari ini.</p>
        </header>

        {/* 1. KARTU STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pendapatan */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Pendapatan</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{formatRupiah(totalRevenue)}</p>
            <div className="mt-4 h-1 w-full bg-green-100 rounded-full">
                <div className="h-1 bg-green-500 w-[70%] rounded-full"></div>
            </div>
          </div>
          
          {/* Total Booking */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Booking</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{totalCount}</p>
            <p className="text-sm text-gray-400 mt-2">Sepanjang waktu</p>
          </div>

          {/* Menunggu Konfirmasi */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Perlu Konfirmasi</p>
            <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
                <span className="text-sm text-yellow-600 mb-1 font-medium">pesanan baru</span>
            </div>
          </div>
        </div>

        {/* 2. JADWAL INTERAKTIF (Komponen Kalender) */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-5 border-b bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    📅 Kelola Jadwal
                </h3>
             </div>
             <div className="p-6">
                <AdminSchedule fields={fields} />
             </div>
        </section>

        {/* 2.5 PROMO MANAGER */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-5 border-b bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    🎉 Kelola Promo
                </h3>
             </div>
             <div className="p-6">
                <PromoManager />
             </div>
        </section>

        {/* 3. TABEL DATA (Komponen Tabel) */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="overflow-x-auto">
                <AdminBookingTable bookings={bookings} />
             </div>
        </section>

    </div>
  );
}