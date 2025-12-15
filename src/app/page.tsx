import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import UserSchedule from "@/components/UserSchedule"; // Import komponen baru

export const dynamic = 'force-dynamic'; // Agar data selalu fresh

export default async function Home() {
  const fields = await prisma.field.findMany();

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* 1. NAVBAR */}
      <nav className="fixed w-full z-[100] top-0 start-0 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="self-center text-2xl font-extrabold whitespace-nowrap text-white tracking-tighter">
              ⚡ SETIA MINISOCCER
            </span>
          </Link>
          <div className="flex md:order-2 space-x-3 gap-4">
            <Link 
                href="/cek-booking"
                className="text-white bg-transparent border border-white/30 hover:bg-white hover:text-black focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 transition"
            >
              🔍 Cek Pesanan
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <Image 
                src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=2071&auto=format&fit=crop"
                alt="Stadium Background"
                fill
                className="object-cover brightness-[0.4]"
                priority
            />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block shadow-lg shadow-green-900/50">
                Premium Mini Soccer
            </span>
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight leading-none text-white md:text-7xl drop-shadow-lg">
                Main Seperti <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Bintang Liga</span>
            </h1>
            <p className="mb-8 text-lg font-light text-gray-300 lg:text-xl sm:px-16 lg:px-48">
                Rasakan kualitas rumput standar FIFA, pencahayaan stadion profesional, dan fasilitas lengkap.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                <Link href="#live-schedule" className="inline-flex justify-center items-center py-4 px-8 text-base font-bold text-center text-black rounded-full bg-white hover:bg-gray-100 transition transform hover:scale-105 shadow-xl shadow-white/10">
                    Cek Jadwal Kosong
                </Link>
            </div>
        </div>
      </section>

      {/* 3. NEW FEATURE: LIVE SCHEDULE CHECKER */}
      <section id="live-schedule" className="py-20 bg-white relative -mt-20 z-20">
         <div className="text-center mb-10 px-4">
             <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Real-time Availability</span>
             <h2 className="text-3xl font-bold text-gray-900 mt-2">Cek Slot Kosong Hari Ini</h2>
         </div>
         {/* Panggil Komponen Jadwal User Disini */}
         <UserSchedule fields={fields} />
      </section>

      {/* 4. FEATURES */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Kenapa Memilih Kami?</h2>
                <div className="w-20 h-1 bg-green-500 mx-auto rounded"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 text-center group">
                    <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl group-hover:scale-110 transition">🌱</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Rumput Standar FIFA</h3>
                    <p className="text-gray-500 leading-relaxed">Rumput sintetis monofilamen import yang empuk dan aman saat jatuh.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 text-center group">
                    <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl group-hover:scale-110 transition">💡</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Lighting Pro 300 Lux</h3>
                    <p className="text-gray-500 leading-relaxed">Main malam seterang siang hari dengan lampu LED tanpa bayangan.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 text-center group">
                    <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl group-hover:scale-110 transition">🚿</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">Fasilitas Premium</h3>
                    <p className="text-gray-500 leading-relaxed">Kamar bilas air hangat, loker aman, mushola, dan kantin nyaman.</p>
                </div>
            </div>
        </div>
      </section>

      {/* 5. BOOKING LIST */}
      <section id="booking-area" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <span className="text-green-600 font-bold tracking-wider uppercase text-sm">Booking Online</span>
                <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Pilih Lapangan Favoritmu</h2>
                <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Klik tombol booking di bawah ini untuk mengamankan jadwal permainan tim Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fields.map((field) => (
                <div key={field.id} className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 relative group flex flex-col h-full">
                    <div className="relative h-64 w-full overflow-hidden">
                        {field.imageUrl ? (
                        <Image 
                            src={field.imageUrl} 
                            alt={field.name}
                            fill
                            className="object-cover group-hover:scale-110 transition duration-700"
                        />
                        ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm z-10">
                        {field.type}
                        </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col relative bg-white">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{field.name}</h2>
                        <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                        {field.description}
                        </p>
                        
                        <div className="pt-6 border-t border-gray-100 mt-auto relative z-20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Harga Sewa</p>
                                    <p className="text-xl font-bold text-green-600">
                                    Rp {field.pricePerHour.toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <Link 
                                    href={`/field/${field.id}`} 
                                    className="relative z-50 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition shadow-lg active:scale-95 flex items-center gap-2"
                                >
                                    Book Now <span>&rarr;</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-black text-white py-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
                <h3 className="text-2xl font-extrabold mb-4 italic">⚡ SETIA MINISOCCER</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                    Platform booking mini soccer modern. Pengalaman bermain bola profesional untuk semua kalangan.
                </p>
            </div>
            <div>
                <h4 className="font-bold text-lg mb-4 text-green-500">Menu</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                    <li><Link href="/" className="hover:text-white transition">Beranda</Link></li>
                    <li><Link href="#booking-area" className="hover:text-white transition">Daftar Lapangan</Link></li>
                    <li><Link href="/cek-booking" className="hover:text-white transition">Cek Pesanan</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-lg mb-4 text-green-500">Kontak</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="flex items-start gap-2"><span>📍</span> Jl. Sudirman No. 1, Jakarta</li>
                    <li className="flex items-center gap-2"><span>📞</span> +62 812-3456-7890</li>
                    <li className="flex items-center gap-2"><span>✉️</span> booking@sportcenter.com</li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-900 text-center text-xs text-gray-600">
            © 2025 Setia Minisoccer Booking System. Build by Rs
        </div>
      </footer>

      {/* WHATSAPP BUTTON */}
      <a
        href="https://wa.me/6285117692051?text=Halo%20Admin,%20saya%20tertarik%20booking%20lapangan."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[100] group"
        aria-label="Chat via WhatsApp"
      >
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-xs font-bold px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
          Tanya Coach AI 🤖
        </span>
        <div className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-2xl transition transform hover:scale-110 flex items-center justify-center w-16 h-16">
          <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>
      </a>
    </div>
  );
}