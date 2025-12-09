import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Sesuaikan path jika perlu (misal ../../lib/prisma)
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ reply: "Maaf, saya tidak menangkap pesan Anda." });
    }

    // 1. Inisialisasi Gemini
    // Pastikan API Key sudah ada di .env
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    
    // 2. Ambil Data Lapangan dari Database (Real-time Context)
    const fields = await prisma.field.findMany({
        select: { name: true, type: true, pricePerHour: true, description: true }
    });
    
    // Format data menjadi string agar bisa dibaca AI
    const fieldsContext = fields.map(f => 
        `- ${f.name} (${f.type}): Rp${f.pricePerHour.toLocaleString('id-ID')}/jam. Info: ${f.description}`
    ).join("\n");

    // 3. Definisikan Karakter AI (System Instruction)
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
      2. Jika user ingin booking, JANGAN minta transfer. Arahkan ke website: https://minisoccer-web.vercel.app/ (atau link localhost).
      3. Jika kamu tidak tahu jawabannya, arahkan ke Admin WA: 08123456789.
    `;

    // 4. Konfigurasi Model
    // Gunakan "gemini-1.5-flash" (standar cepat) atau sesuaikan jika Anda punya akses ke versi "2.5" spesifik
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        systemInstruction: systemInstruction 
    });

    // 5. Kirim Pesan User ke AI
    const result = await model.generateContent(message);
    const response = await result.response;
    const aiReply = response.text();

    return NextResponse.json({ reply: aiReply });

  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ reply: "Maaf, Coach AI sedang pemanasan (Server Error)." });
  }
}