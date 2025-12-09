import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");

export async function middleware(request: NextRequest) {
  // 1. Tentukan rute yang mau dijaga
  const path = request.nextUrl.pathname;
  
  // Jika user mencoba masuk ke halaman admin...
  if (path.startsWith("/admin")) {
    
    // 2. Cek apakah user punya cookie "admin_session"
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      // Tidak ada token? Tendang ke halaman login
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // 3. Verifikasi keaslian token (Cek tanda tangan digital)
      await jwtVerify(token, SECRET_KEY);
      // Jika lolos, silakan lanjut
      return NextResponse.next();
      
    } catch (error) {
      // Token palsu atau expired? Tendang ke login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Konfigurasi: Middleware hanya aktif di path tertentu agar performa tetap kencang
export const config = {
  matcher: ["/admin/:path*"], // Terapkan hanya untuk rute /admin dan anak-anaknya
};