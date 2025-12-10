import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar dipasang di sini, otomatis muncul di semua halaman admin */}
      <AdminNavbar />
      
      {/* Area Konten Halaman */}
      <main>
        {children}
      </main>
    </div>
  );
}