import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET promo by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const promo = await prisma.promo.findUnique({
      where: { id },
    });

    if (!promo) {
      return NextResponse.json({ error: "Promo not found" }, { status: 404 });
    }

    return NextResponse.json(promo);
  } catch (error) {
    console.error("Error fetching promo:", error);
    return NextResponse.json(
      { error: "Failed to fetch promo" },
      { status: 500 }
    );
  }
}

// PUT update promo
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      title,
      description,
      emoji,
      borderColor,
      buttonColor,
      buttonHoverColor,
      whatsappText,
    } = body;

    const promo = await prisma.promo.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(emoji && { emoji }),
        ...(borderColor && { borderColor }),
        ...(buttonColor && { buttonColor }),
        ...(buttonHoverColor && { buttonHoverColor }),
        ...(whatsappText && { whatsappText }),
      },
    });

    return NextResponse.json(promo);
  } catch (error) {
    console.error("Error updating promo:", error);
    return NextResponse.json(
      { error: "Failed to update promo" },
      { status: 500 }
    );
  }
}

// DELETE promo
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.promo.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Promo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting promo:", error);
    return NextResponse.json(
      { error: "Failed to delete promo" },
      { status: 500 }
    );
  }
}
