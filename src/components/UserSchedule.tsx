'use client'

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getBookingsByDate } from "@/app/actions/getBookings"; 

type Field = { id: string; name: string; type: string };
type BookingSimple = { fieldId: string; startTime: string; status: string };

export default function UserSchedule({ fields }: { fields: Field[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<BookingSimple[]>([]);
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", 
    "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
  ];

  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      getBookingsByDate(selectedDate).then((res) => {
        if (res.success && res.data) {
          setBookings(res.data as unknown as BookingSimple[]);
        }
        setLoading(false);
      });
    }
  }, [selectedDate]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Wrapper Kartu */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        
        {/* BAGIAN KIRI: KALENDER (Warna Gelap agar Kontras) */}
        <div className="md:w-1/3 bg-gray-900 text-white p-8 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Dekorasi Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            
            <h3 className="text-2xl font-bold mb-6 relative z-10">📅 Cek Tanggal</h3>
            <div className="bg-white text-gray-900 rounded-xl p-2 shadow-lg relative z-10">
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={id}
                    styles={{
                        caption: { color: '#111827' },
                        head_cell: { color: '#6B7280' },
                    }}
                />
            </div>
            <p className="mt-6 text-green-400 font-medium relative z-10">
                {selectedDate ? format(selectedDate, 'eeee, dd MMMM yyyy', { locale: id }) : '-'}
            </p>
        </div>

        {/* BAGIAN KANAN: GRID JADWAL */}
        <div className="md:w-2/3 p-8 bg-gray-50">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    ⚡ Status Lapangan
                </h3>
                <div className="flex gap-3 text-xs font-bold">
                    <span className="px-3 py-1 rounded-full bg-white border border-green-200 text-green-700 shadow-sm">
                        TERSEDIA
                    </span>
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 shadow-sm">
                        FULL BOOKED
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-pulse">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin mb-4"></div>
                    Memuat ketersediaan...
                </div>
            ) : (
                <div className="space-y-8">
                    {fields.map(field => (
                        <div key={field.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-gray-800 text-lg">{field.name}</h4>
                                <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase tracking-wide">
                                    {field.type}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                {timeSlots.map(time => {
                                    const isBooked = bookings.some(b => 
                                        b.fieldId === field.id && 
                                        b.startTime === time && 
                                        (b.status === 'CONFIRMED' || b.status === 'LUNAS')
                                    );
                                    
                                    return (
                                        <div 
                                            key={time}
                                            className={`
                                                relative group text-[10px] sm:text-xs py-2 rounded-lg text-center font-bold transition-all cursor-default select-none
                                                ${isBooked 
                                                    ? 'bg-red-50 text-red-400 opacity-50 line-through decoration-red-400' 
                                                    : 'bg-green-500 text-white shadow-lg shadow-green-200 hover:bg-green-600 hover:scale-110'}
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
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="mt-6 text-center">
                 <p className="text-sm text-gray-500">
                    Ingin booking jam yang kosong? Scroll ke bawah & pilih lapangan! 👇
                 </p>
            </div>
        </div>
      </div>
    </div>
  );
}