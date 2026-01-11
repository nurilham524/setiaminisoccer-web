import { prisma } from "@/lib/prisma";
import AdminBookingTable from "@/components/AdminBookingTable";
import AdminSchedule from "@/components/JadwalAdmin";
import PromoManager from "@/components/PromoManager";

export const dynamic = "force-dynamic";

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default async function AdminDashboard() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      field: true,
      user: {
        select: { name: true, email: true },
      },
    },
  });

  const fields = await prisma.field.findMany();

  const allConfirmedBookings = await prisma.booking.findMany({
    where: { status: "CONFIRMED" },
  });

  const totalRevenue = allConfirmedBookings.reduce(
    (sum, b) => sum + (b.totalPrice || 0),
    0
  );

  const pendingCount = await prisma.booking.count({
    where: { status: "PENDING" },
  });

  const totalCount = await prisma.booking.count();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          Pantau performa bisnis dan jadwal lapangan hari ini.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
            Total Pendapatan
          </p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {formatRupiah(totalRevenue)}
          </p>
          <div className="mt-4 h-1 w-full bg-green-100 rounded-full">
            <div className="h-1 bg-green-500 w-[70%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
            Total Booking
          </p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{totalCount}</p>
          <p className="text-sm text-gray-400 mt-2">Sepanjang waktu</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
            Perlu Konfirmasi
          </p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {pendingCount}
            </p>
            <span className="text-sm text-yellow-600 mb-1 font-medium">
              pesanan baru
            </span>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#000000"
              viewBox="0 0 256 256"
            >
              <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z"></path>
            </svg>{" "}
            Kelola Jadwal
          </h3>
        </div>
        <div className="p-6">
          <AdminSchedule fields={fields} />
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#000000"
              viewBox="0 0 256 256"
            >
              <path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z"></path>
            </svg>{" "}
            Kelola Promo
          </h3>
        </div>
        <div className="h-[700px] overflow-hidden">
          <PromoManager />
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <AdminBookingTable bookings={bookings} />
        </div>
      </section>
    </div>
  );
}
