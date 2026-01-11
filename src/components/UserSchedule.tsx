"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import { getBookingsByDate } from "@/app/actions/getBookings";
import BookingModal from "./BookingModal";

type Field = { id: string; name: string; type: string };
type BookingSimple = { fieldId: string; startTime: string; endTime: string; status: string };
type BookingModalData = {
  fieldId: string;
  fieldName: string;
  date: string;
  times: string[];
  price: number;
};

export default function UserSchedule({ fields }: { fields: Field[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [bookings, setBookings] = useState<BookingSimple[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<BookingModalData | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

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
        try {
          const res = await getBookingsByDate(selectedDate);
          if (res.success && res.data) {
            setBookings(res.data as unknown as BookingSimple[]);
          } else {
            console.error("Failed to fetch bookings:", res.error);
            setBookings([]);
          }
        } catch (error) {
          console.error("Error fetching bookings:", error);
          setBookings([]);
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    }
  }, [selectedDate]);

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
      return 350000;
    if (["16:00", "17:00", "18:00"].includes(t)) return 600000;
    if (t === "19:00") return 500000;
    if (["20:00", "21:00"].includes(t)) return 800000;
    if (["22:00", "23:00"].includes(t)) return 600000;
    return 0;
  };

  const handleBookingSuccess = async () => {
    if (selectedDate) {
      const res = await getBookingsByDate(selectedDate);
      if (res.success && res.data) {
        setBookings(res.data as unknown as BookingSimple[]);
      }
    }
  };

  function areTimesSequential(times: string[]) {
    if (times.length <= 1) return true;
    const sorted = [...times].sort();
    for (let i = 1; i < sorted.length; i++) {
      const prev = parse(sorted[i - 1], "HH:mm", new Date());
      const curr = parse(sorted[i], "HH:mm", new Date());
      if (curr.getTime() - prev.getTime() !== 60 * 60 * 1000) return false;
    }
    return true;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {fields && fields.length === 0 && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-yellow-800 text-sm">
          ⚠️ Tidak ada lapangan yang tersedia. Hubungi admin untuk menambahkan lapangan.
        </div>
      )}
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-white p-8 flex flex-col items-center justify-center relative overflow-hidden">
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
            {/* <div className="flex gap-3 text-xs font-bold">
              <span className="px-3 py-1 rounded-full bg-white border border-blue-200 text-blue-700 shadow-sm">
                TERSEDIA
              </span>
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 shadow-sm">
                FULL BOOKED
              </span>
            </div> */}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-pulse">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              Memuat ketersediaan...
            </div>
          ) : fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p className="text-lg font-medium">Tidak ada lapangan tersedia</p>
              <p className="text-sm text-gray-500 mt-2">Hubungi admin untuk menambahkan lapangan</p>
            </div>
          ) : (
            <div className="space-y-8">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition min-h-80 flex flex-col"
                >
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 flex-1">
                    {timeSlots.map((time) => {
                      const isBooked = bookings.some((b) => {
                        if (b.fieldId !== field.id) return false;
                        if (!(b.status === "PENDING" || b.status === "CONFIRMED")) return false;
                        const timeHour = parseInt(time.split(":")[0]);
                        const startHour = parseInt(b.startTime.split(":")[0]);
                        const endHour = parseInt(b.endTime.split(":")[0]);
                        
                        return timeHour >= startHour && timeHour < endHour;
                      });
                      const price = getPrice(time);
                      const isSelected = selectedTimes.includes(time);

                      return (
                        <button
                          key={time}
                          disabled={isBooked}
                          className={`
                            relative group h-18 flex flex-col items-center justify-center rounded-lg font-semibold transition-all select-none duration-150
                            ${
                              isBooked
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-40"
                                : isSelected
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-blue-300 cursor-pointer"
                            }
                          `}
                          onClick={() => {
                            if (isBooked) return;
                            let newSelected: string[];
                            if (isSelected) {
                              newSelected = selectedTimes.filter(
                                (t) => t !== time
                              );
                            } else {
                              newSelected = [...selectedTimes, time];
                            }
                            newSelected = newSelected.sort();
                            if (areTimesSequential(newSelected)) {
                              setSelectedTimes(newSelected);
                            }
                          }}
                        >
                          <span className="text-xs md:text-sm font-bold">
                            {time}
                          </span>
                          <span
                            className={`text-[8px] md:text-xs font-medium mt-0.5 ${
                              isSelected ? "text-white" : "text-gray-500"
                            }`}
                          >
                            {price ? `Rp${price / 1000}K` : ""}
                          </span>
                          {!isBooked && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-[9px] py-1 px-2 rounded whitespace-nowrap z-20 font-medium">
                              Pilih
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selectedTimes.length > 0 && (
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Total:
                        </p>
                        <p className="text-sm font-bold text-blue-600">
                          {selectedTimes.length} Jam • Rp{" "}
                          {selectedTimes
                            .reduce((sum, t) => sum + getPrice(t), 0)
                            .toLocaleString("id-ID")}
                        </p>
                      </div>
                      <button
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-150 text-sm"
                        onClick={() => {
                          if (!selectedDate) return;
                          setModalData({
                            fieldId: field.id,
                            fieldName: field.name,
                            date: format(selectedDate, "yyyy-MM-dd"),
                            times: selectedTimes,
                            price: selectedTimes.reduce(
                              (sum, t) => sum + getPrice(t),
                              0
                            ),
                          });
                          setModalOpen(true);
                        }}
                      >
                        Booking
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && modalData && (
        <BookingModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedTimes([]);
          }}
          fieldId={modalData.fieldId}
          fieldName={modalData.fieldName}
          date={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
          times={modalData.times}
          price={modalData.price}
          onBooked={() => {
            setModalOpen(false);
            setSelectedTimes([]);
            handleBookingSuccess();
          }}
        />
      )}
    </div>
  );
}
