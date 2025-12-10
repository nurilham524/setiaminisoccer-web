import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // Wajib

export async function GET() {
  return NextResponse.json({ message: "GET berhasil! Server hidup." });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      message: "POST berhasil!", 
      data_diterima: body 
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal baca body" }, { status: 400 });
  }
}