import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic'; 

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userMessage = body.message;
    const userPhone = body.sender; 

    if (!userMessage || !userPhone) {
        return NextResponse.json({ status: "No message or sender" });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const fields = await prisma.field.findMany({
        select: { name: true, type: true, pricePerHour: true, description: true }
    });
    
    const fieldsContext = fields.map(f => 
        `- ${f.name} (${f.type}): Rp${f.pricePerHour.toLocaleString('id-ID')}/jam. Info: ${f.description}`
    ).join("\n");

    const systemInstruction = `Kamu adalah "Coach AI", Asisten Virtual untuk 'Sport Center Mini Soccer'.
      
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
      3. Jika kamu tidak tahu jawabannya, arahkan ke Admin WA: 085333358298.`;

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        systemInstruction: systemInstruction 
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const aiReply = response.text();

    const fonnteRes = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
            'Authorization': process.env.FONNTE_TOKEN || '', 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            target: userPhone,
            message: aiReply,
        })
    });
    
    const fonnteData = await fonnteRes.json();
    // console.log("📤 [FONNTE] Status kirim:", fonnteData);

    return NextResponse.json({ status: true, detail: "Pesan terproses" });

  } catch (error) {
    console.error("🔥 ERROR:", error);
    return NextResponse.json({ status: false, error: 'Internal Server Error' }, { status: 500 });
  }
}