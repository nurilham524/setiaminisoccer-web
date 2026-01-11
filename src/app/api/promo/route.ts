import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const promos = await prisma.promo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(promos);
  } catch (error) {
    console.error("Error fetching promos:", error);
    return NextResponse.json(
      { error: "Failed to fetch promos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Judul promo diperlukan" },
        { status: 400 }
      );
    }

    const promo = await prisma.promo.create({
      data: {
        title,
      },
    });

    return NextResponse.json(promo, { status: 201 });
  } catch (error) {
    console.error("Error creating promo:", error);
    return NextResponse.json(
      { error: "Gagal membuat promo" },
      { status: 500 }
    );
  }
}
