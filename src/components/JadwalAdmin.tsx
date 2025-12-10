'use client'

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getBookingsByDate } from "@/app/actions/getBookings"; 

// Tipe data untuk props dan state
type Field = { id: string; name: string; type: string };
type BookingSimple = { fieldId: string; startTime: string; status: string };

export default function AdminSchedule({ fields }: { fields: Field[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<BookingSimple[]>([]);
  const [loading, setLoading] = useState(false);

  // Jam Operasional (08:00 - 22:00)
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", 
    "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
  ];

  // Ambil data setiap kali tanggal berubah
  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      getBookingsByDate(selectedDate).then((res) => {
        if (res.success && res.data) {
          // Casting tipe data agar sesuai
          setBookings(res.data as unknown as BookingSimple[]);
        }
        setLoading(false);
      });
    }
  }, [selectedDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
      {/* BAGIAN KIRI: KALENDER */}
      <div className="md:col-span-4 bg-white p-6 rounded-xl shadow-sm h-fit border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Pilih Tanggal</h3>
        <div className="flex justify-center">
            <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={id}
            />
        </div>
        <p className="text-center mt-4 text-sm text-blue-600 font-medium">
            {selectedDate ? format(selectedDate, 'eeee, dd MMMM yyyy', { locale: id }) : '-'}
        </p>
      </div>

      {/* BAGIAN KANAN: STATUS KETERSEDIAAN */}
      <div className="md:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Status Ketersediaan</h3>
            <div className="flex gap-4 text-xs font-medium">
                <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div> Kosong
                </span>
                <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div> Terisi
                </span>
            </div>
        </div>

        {loading ? (
            <div className="text-center py-12 text-gray-400 animate-pulse bg-gray-50 rounded-lg">
                Memuat data jadwal...
            </div>
        ) : (
            <div className="space-y-6">
                {fields.map(field => (
                    <div key={field.id}>
                        <div className="flex items-center gap-2 mb-2">
                             <span className="font-bold text-gray-700">{field.name}</span>
                             <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-medium">{field.type}</span>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-2">
                            {timeSlots.map(time => {
                                // Cek apakah ada booking yang CONFIRMED/LUNAS di jam ini
                                const isBooked = bookings.some(b => 
                                    b.fieldId === field.id && 
                                    b.startTime === time && 
                                    (b.status === 'CONFIRMED' || b.status === 'LUNAS')
                                );
                                
                                return (
                                    <div 
                                        key={time}
                                        className={`
                                            text-xs py-2 rounded text-center font-bold transition-all border select-none
                                            ${isBooked 
                                                ? 'bg-red-500 text-white border-red-600 shadow-sm' 
                                                : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}
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
        )}
      </div>
    </div>
  );
}