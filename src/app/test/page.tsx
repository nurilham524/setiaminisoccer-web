import BookingForm from "@/components/BookingForm";

export default function TestPage() {
  return (
    <div className="p-20 bg-gray-200 min-h-screen">
      <h1 className="text-3xl mb-10">HALAMAN TES ISOLASI</h1>
      
      {/* Kita taruh form ini sendirian tanpa gangguan layout lain */}
      <div className="bg-white p-10 border-2 border-blue-500">
         <BookingForm fieldId="123" pricePerHour={50000} />
      </div>
    </div>
  );
}