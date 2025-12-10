import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Fonnte mengirimkan data dalam format: { sender: "628xxx", message: "halo", ... }
    const userMessage = body.message;
    const userPhone = body.sender; // Kita butuh ini untuk membalas ke orang yang tepat

    // Cek jika pesan berasal dari diri sendiri (untuk mencegah looping) atau kosong
    if (!userMessage || !userPhone) {
        return NextResponse.json({ status: "No message or sender" });
    }

    // --- LOGIKA GEMINI (SAMA SEPERTI SEBELUMNYA) ---
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    
    // Ambil Data Lapangan
    const fields = await prisma.field.findMany({
        select: { name: true, type: true, pricePerHour: true, description: true }
    });
    
    const fieldsContext = fields.map(f => 
        `- ${f.name} (${f.type}): Rp${f.pricePerHour.toLocaleString('id-ID')}/jam. Info: ${f.description}`
    ).join("\n");

    const systemInstruction = `
      Kamu adalah "Coach AI", Asisten Virtual untuk 'Sport Center Mini Soccer'.
      
      GAYA KOMUNIKASI:
      - Ramah, energik, dan membantu.
      - Gunakan Bahasa Indonesia yang natural (boleh sedikit santai/emoji).
      - Jawaban harus SINGKAT dan PADAT (maksimal 3-4 kalimat).

      INFORMASI LAPANGAN KAMI (Data Real-time):
      ${fieldsContext}
      
      LOKASI & JAM:
      - Alamat: Jl. Sudirman No. 1, Jakarta.
      - Buka: 08:00 - 22:00 WIB.

      ATURAN PENTING:
      1. Jika user bertanya harga/fasilitas, jawab berdasarkan data di atas.
      2. Jika user ingin booking, JANGAN minta transfer. Arahkan ke website: https://setiaminisoccer-web.vercel.app/ (atau link localhost).
      3. Jika kamu tidak tahu jawabannya, arahkan ke Admin WA: 08123456789.
    `;

    // GUNAKAN MODEL YANG BENAR (1.5-flash)
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", 
        systemInstruction: systemInstruction 
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const aiReply = response.text();

    // --- BAGIAN PENTING: KIRIM BALASAN KEMBALI KE FONNTE ---
    // Kita harus "menembak" API Fonnte untuk mengirim pesan WA
    await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
            'Authorization': process.env.FONNTE_TOKEN || '', // Masukkan Token Fonnte di .env
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            target: userPhone,
            message: aiReply,
        })
    });

    // Return sukses ke Fonnte agar tidak dikirim ulang (retry)
    return NextResponse.json({ status: true });

  } catch (error) {
    console.error("Error Processing Chatbot:", error);
    return NextResponse.json({ status: false, error: error }, { status: 500 });
  }
}