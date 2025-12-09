'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type BookingFormProps = {
  fieldId: string
  pricePerHour: number
}

export default function BookingForm({ fieldId, pricePerHour }: BookingFormProps) {
  const router = useRouter()
  
  // STATE BARU: Nama & WhatsApp
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  
  const [date, setDate] = useState('')
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00"
  ]

  const handleBooking = async () => {
    // Validasi Lengkap
    if (!name || !phone || !date || !selectedTime) {
        return alert('Mohon lengkapi Nama, No WA, Tanggal, dan Jam!')
    }
    
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldId,
          date,
          startTime: selectedTime,
          price: pricePerHour,
          // KIRIM DATA BARU KE API
          customerName: name,
          customerPhone: phone
        })
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.error || 'Gagal booking')

      alert('✅ BOOKING SUKSES! Mohon datang tepat waktu.')
      
      // Reset Form
      setSelectedTime(null)
      setDate('')
      setName('')
      setPhone('')
      router.refresh()
      
    } catch (error: any) {
      alert(`❌ GAGAL: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 1. INPUT DATA DIRI (BARU) */}
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Data Penyewa</h3>
        
        <div>
            <label className="text-xs text-gray-500">Nama Lengkap</label>
            <input 
                type="text" 
                placeholder="Contoh: Budi Santoso"
                className="w-full border p-2 rounded text-sm focus:outline-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </div>
        
        <div>
            <label className="text-xs text-gray-500">Nomor WhatsApp</label>
            <input 
                type="tel" 
                placeholder="Contoh: 08123456789"
                className="w-full border p-2 rounded text-sm focus:outline-blue-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
        </div>
      </div>

      {/* 2. INPUT TANGGAL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Tanggal</label>
        <input 
          type="date" 
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-black outline-none"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
            setSelectedTime(null)
          }}
          min={new Date().toISOString().split('T')[0]} 
        />
      </div>

      {/* 3. INPUT JAM */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Jam Main</label>
        {!date ? (
          <p className="text-sm text-gray-400 italic">Pilih tanggal dulu...</p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`
                  py-2 text-xs font-bold rounded transition
                  ${selectedTime === time 
                    ? 'bg-black text-white shadow-lg scale-105' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {time}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. TOTAL & SUBMIT */}
      {selectedTime && (
        <div className="bg-green-50 p-3 rounded-md border border-green-200 mt-2">
          <p className="text-xs text-green-800 uppercase">Total Bayar</p>
          <p className="text-xl font-bold text-green-700">Rp {pricePerHour.toLocaleString('id-ID')}</p>
        </div>
      )}

      <button
        onClick={handleBooking}
        disabled={!name || !phone || !date || !selectedTime || isSubmitting}
        className={`
          w-full py-3 rounded-lg font-bold text-white mt-2 transition
          ${!name || !phone || !date || !selectedTime 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700 shadow-lg'
          }
        `}
      >
        {isSubmitting ? 'Memproses...' : 'KONFIRMASI BOOKING'}
      </button>
    </div>
  )
}