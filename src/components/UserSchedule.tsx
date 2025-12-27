"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getBookingsByDate } from "@/app/actions/getBookings";

type Field = { id: string; name: string; type: string };
type BookingSimple = { fieldId: string; startTime: string; status: string };

export default function UserSchedule({ fields }: { fields: Field[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [bookings, setBookings] = useState<BookingSimple[]>([]);
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  useEffect(() => {
    if (selectedDate) {
      const fetchBookings = async () => {
        setLoading(true);
        const res = await getBookingsByDate(selectedDate);
        if (res.success && res.data) {
          setBookings(res.data as unknown as BookingSimple[]);
        }
        setLoading(false);
      };
      fetchBookings();
    }
  }, [selectedDate]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Wrapper Kartu */}
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 flex flex-col md:flex-row">
        {/* BAGIAN KIRI: KALENDER (Warna Gelap agar Kontras) */}
        <div className="md:w-1/3 bg-white p-8 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Dekorasi Background */}
          {/* <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div> */}

          <h3 className="text-2xl font-bold text-black mb-6 relative z-10 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="#000000"
              viewBox="0 0 256 256"
            >
              <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z"></path>
            </svg>{" "}
            Cek Tanggal
          </h3>
          <div className="bg-white text-gray-900 border border-gray-200 rounded-xl p-2 relative z-10">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={id}
              styles={{
                caption: { color: "#111827" },
                head_cell: { color: "#6B7280" },
              }}
            />
          </div>
          <p className="mt-6 text-blue-400 font-medium relative z-10">
            {selectedDate
              ? format(selectedDate, "eeee, dd MMMM yyyy", { locale: id })
              : "-"}
          </p>
        </div>

        {/* BAGIAN KANAN: GRID JADWAL */}
        <div className="md:w-2/3 p-8 bg-gray-50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#000000"
                viewBox="0 0 256 256"
              >
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path>
              </svg>{" "}
              Status Lapangan
            </h3>
            <div className="flex gap-3 text-xs font-bold">
              <span className="px-3 py-1 rounded-full bg-white border border-blue-200 text-blue-700 shadow-sm">
                TERSEDIA
              </span>
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 shadow-sm">
                FULL BOOKED
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-pulse">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              Memuat ketersediaan...
            </div>
          ) : (
            <div className="space-y-8">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  {/* <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-800 text-lg">
                      {field.name}
                    </h4>
                    <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase tracking-wide">
                      {field.type}
                    </span>
                  </div> */}

                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {timeSlots.map((time) => {
                      const isBooked = bookings.some(
                        (b) =>
                          b.fieldId === field.id &&
                          b.startTime === time &&
                          (b.status === "CONFIRMED" || b.status === "LUNAS")
                      );
                      // Fungsi untuk menentukan harga berdasarkan jam
                      const getPrice = (t: string) => {
                        if (
                          [
                            "07:00",
                            "08:00",
                            "09:00",
                            "10:00",
                            "11:00",
                            "12:00",
                            "13:00",
                            "14:00",
                            "15:00",
                          ].includes(t)
                        )
                          return "350K";
                        if (["16:00", "17:00", "18:00"].includes(t))
                          return "600K";
                        if (t === "19:00") return "500K";
                        if (["20:00", "21:00"].includes(t)) return "800K";
                        if (["22:00", "23:00"].includes(t)) return "600K";
                        return "";
                      };

                      return (
                        <div key={time} className="flex flex-col items-center">
                          <div
                            className={`
            relative group text-[10px] sm:text-xs py-2 w-full rounded-lg text-center font-bold transition-all cursor-default select-none
            ${
              isBooked
                ? "bg-red-50 text-red-400 opacity-50 line-through decoration-red-400"
                : "bg-blue-500 text-white shadow-lg hover:bg-blue-600 hover:scale-110"
            }
          `}
                          >
                            {time}
                            {/* Tooltip Hover (Hanya jika tersedia) */}
                            {!isBooked && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20">
                                Klik Booking
                              </div>
                            )}
                          </div>
                          <div className="text-[9px] sm:text-xs text-gray-400 text-center font-semibold mt-1">
                            {getPrice(time)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
