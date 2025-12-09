import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret");

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // 1. Cek Password (Hardcoded dari .env untuk kesederhanaan)
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Password salah!" },
        { status: 401 }
      );
    }

    // 2. Buat Token JWT (Gelang Tiket)
    // Token ini berisi klaim bahwa user adalah 'admin'
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h") // Token berlaku 2 jam
      .sign(SECRET_KEY);

    // 3. Simpan Token di HTTP-Only Cookie
    // (Aman dari serangan XSS karena JavaScript browser tidak bisa membacanya)
    (await
          // 3. Simpan Token di HTTP-Only Cookie
          // (Aman dari serangan XSS karena JavaScript browser tidak bisa membacanya)
          cookies()).set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 jam
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}