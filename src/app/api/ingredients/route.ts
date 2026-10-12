import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { INITIAL_INGREDIENTS } from "@/lib/storage";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        data: INITIAL_INGREDIENTS,
        source: "local-seed",
        message: "Menggunakan data lokal (DATABASE_URL belum dikonfigurasi)",
      });
    }

    const ingredients = await prisma.ingredient.findMany({
      orderBy: { name: "asc" },
    });

    if (ingredients.length === 0) {
      // Seed if empty
      for (const item of INITIAL_INGREDIENTS) {
        await prisma.ingredient.create({
          data: {
            id: item.id,
            name: item.name,
            category: item.category,
            purchasePrice: item.purchasePrice,
            purchaseQty: item.purchaseQty,
            purchaseUnit: item.purchaseUnit,
            yieldPercent: item.yieldPercent,
          },
        });
      }
      return NextResponse.json({
        data: INITIAL_INGREDIENTS,
        source: "database-seeded",
      });
    }

    return NextResponse.json({ data: ingredients, source: "database" });
  } catch (error) {
    console.error("Failed to fetch ingredients:", error);
    // Graceful fallback to initial seed
    return NextResponse.json({
      data: INITIAL_INGREDIENTS,
      source: "fallback",
      error: String(error),
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        data: body,
        source: "mock-saved",
        message: "Tersimpan di local state",
      });
    }

    const created = await prisma.ingredient.create({
      data: {
        name: body.name,
        category: body.category || "BAHAN_BAKU",
        purchasePrice: Number(body.purchasePrice),
        purchaseQty: Number(body.purchaseQty),
        purchaseUnit: body.purchaseUnit,
        yieldPercent: Number(body.yieldPercent) || 100,
      },
    });

    return NextResponse.json({ data: created, success: true });
  } catch (error) {
    console.error("Failed to create ingredient:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan bahan baku" },
      { status: 500 }
    );
  }
}
