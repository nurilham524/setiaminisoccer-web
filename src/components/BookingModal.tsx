/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
  fieldId: string;
  fieldName: string;
  date: string;
  time: string;
  price: number;
  onBooked?: () => void;
};

export default function BookingModal({
  open,
  onClose,
  fieldId,
  date,
  time,
  price,
  onBooked,
}: BookingModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleBooking = async () => {
    if (!name || !phone) {
      alert("Mohon isi nama dan nomor WhatsApp!");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldId,
          date,
          startTime: time,
          price,
          customerName: name,
          customerPhone: phone,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal booking");
      alert("✅ BOOKING SUKSES! Mohon datang tepat waktu.");
      setName("");
      setPhone("");
      onClose();
      onBooked && onBooked();
    } catch (error: any) {
      alert(`❌ GAGAL: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md relative animate-fadeIn">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h2 className="m-0 font-medium mb-2 text-gray-800">
            Booking Lapangan
          </h2>

          <button
            className="text-gray-400 hover:text-black"
            onClick={onClose}
            aria-label="Tutup"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#000000"
              viewBox="0 0 256 256"
            >
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          </button>
        </div>
        <div className="space-y-3 mb-6 pt-3 px-4">
          <div>
            <label className="block font-medium text-sm text-black mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 p-2 rounded-md text-sm text-black focus:outline-blue-500"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium text-sm text-black mb-1">
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              className="w-full border border-gray-200 p-2 rounded-md text-sm text-black focus:outline-blue-500"
              placeholder="08xxxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4 text-sm text-gray-500 pb-3 px-4">
          {/* <div>
            <span className="font-semibold text-gray-700">Lapangan:</span>{" "}
            {fieldName}
          </div> */}
          <div className="py-2">
            <span className="font-semibold text-gray-700">Tanggal:</span> {date}
          </div>
          <div className="py-2">
            <span className="font-semibold text-gray-700">Jam:</span> {time}
          </div>
          <div className="py-2">
            <span className="font-semibold text-gray-700">Harga:</span>{" "}
            <span className="font-bold text-blue-700">
              Rp {price.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-4 pb-4">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-bold text-white shadow-lg ${
              !name || !phone || isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={handleBooking}
            disabled={!name || !phone || isSubmitting}
          >
            {isSubmitting ? "Memproses..." : "Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
