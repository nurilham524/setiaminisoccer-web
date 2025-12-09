import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Di Next.js 15, cookies() adalah Promise yang harus di-await
  const cookieStore = await cookies();
  
  // Hapus cookie tiket masuk
  cookieStore.delete("admin_session");
  
  return NextResponse.json({ success: true });
}