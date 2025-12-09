'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (!confirm("Yakin ingin keluar dari Admin?")) return;
    
    setLoading(true);
    try {
      // Panggil API Logout untuk hapus cookie
      await fetch("/api/auth/logout", { method: "POST" });
      
      // Redirect ke halaman login
      router.push("/login");
      router.refresh(); // Pastikan middleware mendeteksi cookie sudah hilang
    } catch (error) {
      alert("Gagal logout");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full text-left py-2 px-4 mt-auto bg-red-900 hover:bg-red-700 text-white rounded transition flex items-center gap-2 text-sm font-bold"
    >
      {loading ? "Keluar..." : "🚪 Logout Admin"}
    </button>
  );
}