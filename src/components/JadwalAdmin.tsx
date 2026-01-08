/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getBookingsByDate } from "@/app/actions/getBookings"; 

// Tipe data untuk props dan state
type Field = { id: string; name: string; type: string };
type BookingSimple = { fieldId: string; startTime: string; endTime: string; status: string };

export default function AdminSchedule({ fields }: { fields: Field[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<BookingSimple[]>([]);
  const [loading, setLoading] = useState(false);

  // Jam Operasional (07:00 - 22:00)
  const timeSlots = [
    "07:00","08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", 
    "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
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
            <div className="flex gap-6 text-xs font-medium flex-wrap">
                <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Siap Booking
                </span>
                <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div> Ter-Booking
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
                                // Cek apakah jam ini dalam range booking
                                const isBooked = bookings.some(b => {
                                    if (b.fieldId !== field.id) return false;
                                    if (!(b.status === 'PENDING' || b.status === 'CONFIRMED')) return false;
                                    
                                    const timeHour = parseInt(time.split(":")[0]);
                                    const startHour = parseInt(b.startTime.split(":")[0]);
                                    const endHour = parseInt(b.endTime.split(":")[0]);
                                    
                                    return timeHour >= startHour && timeHour < endHour;
                                });
                                
                                const bgColor = isBooked 
                                    ? 'bg-gray-300 text-gray-700 border-gray-400 cursor-not-allowed'
                                    : 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600';
                                
                                return (
                                    <div 
                                        key={time}
                                        className={`
                                            text-xs py-2 rounded-lg text-center font-semibold transition-all border select-none
                                            ${bgColor}
                                        `}
                                        title={isBooked ? 'Ter-Booking' : 'Siap Booking'}
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