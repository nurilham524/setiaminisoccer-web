import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import UserSchedule from "@/components/UserSchedule";
import HLogo from "@/../public/MLogo.jpg";
import HImg from "@/../public/HeroImage.jpg";
import { PromoCarousel } from "@/components/PromoCarousel";
import { FacilitiesCarousel } from "@/components/FacilitiesCarousel";
import { WhyChooseUs } from "@/components/WhyChooseUs";

export const dynamic = "force-dynamic";

export default async function Home() {
  const fields = await prisma.field.findMany();

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* 1. NAVBAR - Responsif z-index dan padding */}
      <nav className="fixed top-0 z-[100] w-full border-b border-gray-200 bg-white backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 py-2 md:py-0">
          <Link href="/" className="flex items-center space-x-2">
            <span className="self-center text-2xl font-extrabold whitespace-nowrap text-white tracking-tighter">
              <Image
                src={HLogo}
                alt="SETIA MINISOCCER Logo"
                // Logo lebih kecil di HP (w-40) dan normal di Desktop (md:w-60)
                className="w-40 md:w-60 ms-[-20px] md:ms-[-37px]"
              />
            </span>
          </Link>
          <div className="flex md:order-2 space-x-3 gap-4">
            <Link
              href="#live-schedule"
              className="text-white font-bold bg-blue-500 border border-gray-200 hover:bg-blue-600 hover:text-white focus:outline-none rounded-lg text-xs md:text-sm px-4 py-2 md:px-5 md:py-2.5 transition"
            >
              Book Now
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION - Stack vertikal di HP, Horizontal di Desktop */}
      <section className="flex flex-col md:flex-row items-center justify-center min-h-screen max-w-7xl mx-auto pt-20 md:pt-0">
        <div className="px-6 md:px-4 mt-8 md:mt-16 w-full md:w-1/2 text-center md:text-left">
          <h1 className="mb-4 md:mb-6 text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight text-gray-400 drop-shadow-lg">
            SETIA <br />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              MINI SOCCER
            </span>
          </h1>
          <p className="mb-6 md:mb-8 text-base md:text-lg font-light text-gray-400 lg:text-xl">
            Lapangan Mini Soccer dengan kualitas rumput berstandar FIFA,
            Berlokasi di pusat kota Tenggarong sehingga mudah diakses.
            Dilengkapi fasilitas pendukung yang membuat pemain dan penonton
            lebih nyaman menikmati pertandingan.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
            <Link
              href="#live-schedule"
              className="inline-flex justify-center items-center py-3 px-6 md:py-4 md:px-8 text-sm md:text-base font-bold text-center text-white rounded-full border border-gray-200 bg-blue-500 hover:bg-blue-600 transition transform hover:scale-105 shadow-xl shadow-white/10"
            >
              Cek Jadwal Kosong
            </Link>
          </div>
        </div>

        {/* Gambar Hero - Hidden di HP agar fokus ke teks, Muncul di Desktop */}
        <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
          <Image
            src={HImg}
            alt="Hero Image"
            className="w-3/4 max-w-sm md:max-w-lg lg:max-w-2xl hidden md:block rounded-2xl"
          />
        </div>
      </section>

      <PromoCarousel />

      <WhyChooseUs />

      {/* 4. LIVE SCHEDULE */}
      <section
        id="live-schedule"
        className="py-16 md:py-20 bg-white relative -mt-10 md:-mt-20 z-20"
      >
        <div className="text-center mb-8 md:mb-10 px-4">
          <span className="text-xs md:text-sm font-bold text-gray-400 tracking-widest uppercase">
            Real-time Availability
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
            Info Lapangan Tersedia
          </h2>
        </div>
        <UserSchedule fields={fields} />
      </section>

      {/* 5. BOOKING AREA */}
      <FacilitiesCarousel />

      {/* FOOTER */}
      <footer className="bg-white text-gray-600 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="md:col-span-2 flex flex-col items-center md:items-start">
            <Image
              src={HLogo}
              alt="SETIA MINISOCCER Logo"
              // Sesuaikan posisi logo di footer agar rapi di HP
              className="w-48 md:w-60 mb-4 md:mb-0 md:ms-[-43px]"
            />
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Platform booking mini soccer modern. Pengalaman bermain bola
              profesional untuk semua kalangan.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-blue-500">Menu</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="#booking-area"
                  className="hover:text-white transition"
                >
                  Daftar Lapangan
                </Link>
              </li>
              <li>
                <Link
                  href="/cek-booking"
                  className="hover:text-white transition"
                >
                  Cek Pesanan
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-blue-500">Kontak</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span>📍</span> Jl. Naga (Depan Hotel Lizha)
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span>📞</span> 085333358298
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span>✉️</span> setiaminisoccer@gmail.com
              </li>
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
        <div className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-2xl transition transform hover:scale-110 flex items-center justify-center w-14 h-14 md:w-16 md:h-16">
          <svg
            className="w-8 h-8 md:w-9 md:h-9"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </div>
      </a>
    </div>
  );
}
