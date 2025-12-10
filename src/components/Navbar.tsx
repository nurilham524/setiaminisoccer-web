// Contoh Navbar
'use client'
import { useSession } from "next-auth/react"; // Jika pakai NextAuth
import Link from "next/link";
// Atau import custom hook session Anda

export default function Navbar() {
  // Ambil session dari NextAuth
  const { data: session } = useSession();
  // Extend user type to include 'role'
  type UserWithRole = typeof session extends { user: infer U } ? U & { role?: string } : { role?: string };
  const user = session?.user as UserWithRole;

  // Simulasi logika
  const isAdmin = user?.role === 'ADMIN'; 

  return (
    <nav>
      {/* Menu Lain... */}
      <Link href="/">Home</Link>
      
      {/* HANYA TAMPIL JIKA ADMIN */}
      {isAdmin && (
        <Link href="/admin" className="text-red-500 font-bold">
          Dashboard Admin
        </Link>
      )}
      
      {/* Menu Lain... */}
    </nav>
  )
}