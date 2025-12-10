'use client'

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function AdminNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* BAGIAN KIRI: LOGO / JUDUL */}
        <div className="flex items-center gap-2">
            <Link href="/admin" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center rounded-lg font-bold text-lg group-hover:bg-blue-600 transition">
                    A
                </div>
                <span className="text-xl font-bold text-gray-800 tracking-tight">
                    Admin<span className="text-blue-600">Panel</span>
                </span>
            </Link>
        </div>

        {/* BAGIAN KANAN: MENU & AKSI */}
        <div className="flex items-center gap-4 md:gap-6">
            {/* Link ke Website Utama (Untuk user check tampilan) */}
            <Link 
                href="/" 
                target="_blank" 
                className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition"
            >
                <span>🌍 Lihat Website</span>
            </Link>

            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

            {/* Profil Admin & Logout */}
            <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                    <p className="text-sm font-bold text-gray-700">Administrator</p>
                    <p className="text-xs text-gray-500">Super User</p>
                </div>
                <LogoutButton />
            </div>
        </div>

      </div>
    </nav>
  );
}