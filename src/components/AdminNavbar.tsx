"use client";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { useState, useRef, useEffect } from "react";

export default function AdminNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        <div className="flex items-center gap-4 md:gap-6">
          {/* Profil Admin Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 hover:opacity-80 transition"
              aria-label="Profile menu"
            >
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-gray-700">Administrator</p>
                <p className="text-xs text-gray-500">Super User</p>
              </div>
              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center rounded-full font-bold shadow-lg hover:shadow-xl transition cursor-pointer">
                AD
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Logout Button */}
                <div className="px-4 py-2">
                  <LogoutButton />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
