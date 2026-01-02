/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Swal from "sweetalert2";

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
  const [step, setStep] = useState<"booking" | "payment">("booking");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "transfer">(
    "qris"
  );

  if (!open) return null;

  const handleBooking = async () => {
    if (!name || !phone) {
      Swal.fire({
        icon: "warning",
        title: "Lengkapi Data!",
        text: "Mohon isi nama dan nomor WhatsApp!",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    // Pindah ke step pembayaran
    setStep("payment");
  };

  const handleConfirmPayment = async () => {
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
          status: "PENDING",
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal booking");
      await Swal.fire({
        icon: "success",
        title: "Booking Terkirim!",
        text: "✅ BOOKING DITERIMA! Status pending menunggu verifikasi admin, selanjutnya akan diinformasikan lewat whatsapp.",
        confirmButtonColor: "#2563eb",
      });
      setName("");
      setPhone("");
      setStep("booking");
      onClose();
      onBooked && onBooked();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal Booking",
        text: error.message,
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToBooking = () => {
    setStep("booking");
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md relative animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h2 className="m-0 font-medium mb-2 text-gray-800">
            {step === "booking" ? "Booking Lapangan" : "Pembayaran"}
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

        {/* STEP 1: BOOKING FORM */}
        {step === "booking" && (
          <>
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
              <div className="py-2">
                <span className="font-semibold text-gray-700">Tanggal:</span>{" "}
                {date}
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
                {isSubmitting ? "Memproses..." : "Lanjut Pembayaran"}
              </button>
            </div>
          </>
        )}

        {/* STEP 2: PAYMENT */}
        {step === "payment" && (
          <>
            <div className="px-4 pt-4">
              {/* Summary Booking */}
              <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Atas Nama:</span> {name}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  <span className="font-semibold">Tanggal & Jam:</span> {date} -{" "}
                  {time}
                </p>
                <p className="text-sm font-bold text-blue-700 mt-2">
                  Total: Rp {price.toLocaleString("id-ID")}
                </p>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Pilih Metode Pembayaran:
                </p>
                <div className="space-y-2">
                  {/* QRIS Option */}
                  <button
                    onClick={() => setPaymentMethod("qris")}
                    className={`w-full p-3 rounded-lg border-2 transition text-left ${
                      paymentMethod === "qris"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <p className="font-semibold text-sm text-gray-800">
                      📱 QRIS
                    </p>
                    <p className="text-xs text-gray-500">Scan QR Code</p>
                  </button>

                  {/* Bank Transfer Option */}
                  <button
                    onClick={() => setPaymentMethod("transfer")}
                    className={`w-full p-3 rounded-lg border-2 transition text-left ${
                      paymentMethod === "transfer"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <p className="font-semibold text-sm text-gray-800">
                      🏦 Transfer Bank
                    </p>
                    <p className="text-xs text-gray-500">Nomor Rekening</p>
                  </button>
                </div>
              </div>

              {/* Payment Details */}
              {paymentMethod === "qris" && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-3">
                    SCAN QR CODE DIBAWAH INI:
                  </p>
                  <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                    <div className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-xs text-gray-400 text-center">
                        <img src="/qris.jpeg" alt="QRIS" className="w-full h-full object-contain" />
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Scan QR Code menggunakan e-wallet atau banking app Anda
                  </p>
                </div>
              )}

              {paymentMethod === "transfer" && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-3">
                    TRANSFER KE REKENING INI:
                  </p>
                  <div className="bg-white p-4 rounded-lg space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Bank</p>
                      <p className="text-sm font-bold text-gray-800">
                        BCA
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Nomor Rekening</p>
                      <p className="text-sm font-bold text-gray-800">
                        8145337638
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Atas Nama</p>
                      <p className="text-sm font-bold text-gray-800">
                        PT SETIA GROUP INVESTAMA 
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Jumlah: Rp {price.toLocaleString("id-ID")}
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-600 bg-yellow-50 p-3 rounded-lg mb-4 border border-yellow-200">
                ℹ️ Setelah melakukan pembayaran, konfirmasi melalui WhatsApp ke
                nomor admin dengan bukti transfer.
              </p>
            </div>

            <div className="flex justify-end gap-2 px-4 pb-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300"
                onClick={handleBackToBooking}
                disabled={isSubmitting}
              >
                Kembali
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-bold text-white shadow-lg ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                onClick={handleConfirmPayment}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Memproses..." : "Konfirmasi Pembayaran"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
