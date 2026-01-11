'use client'
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  type UserWithRole = typeof session extends { user: infer U } ? U & { role?: string } : { role?: string };
  const user = session?.user as UserWithRole;
  const isAdmin = user?.role === 'ADMIN'; 

  return (
    <nav>
      <Link href="/">Home</Link>
      {isAdmin && (
        <Link href="/admin" className="text-red-500 font-bold">
          Dashboard Admin
        </Link>
      )}
    </nav>
  )
}