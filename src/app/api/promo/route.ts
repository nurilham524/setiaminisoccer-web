import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET all promos
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

// POST create new promo
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📝 Received body:", body);

    const {
      title,
      description,
      emoji,
      borderColor = "border-blue-500",
      buttonColor = "bg-blue-500",
      buttonHoverColor = "hover:bg-blue-600",
      whatsappText,
    } = body;

    if (!title || !description || !emoji || !whatsappText) {
      console.log("❌ Missing fields:", { title, description, emoji, whatsappText });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("✅ Creating promo with data:", {
      title,
      description,
      emoji,
      borderColor,
      buttonColor,
      buttonHoverColor,
      whatsappText,
    });

    const promo = await prisma.promo.create({
      data: {
        title,
        description,
        emoji,
        borderColor,
        buttonColor,
        buttonHoverColor,
        whatsappText,
      },
    });

    console.log("✨ Promo created:", promo);
    return NextResponse.json(promo, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating promo:", error);
    return NextResponse.json(
      { 
        error: "Failed to create promo", 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
