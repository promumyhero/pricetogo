import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { INITIAL_MENUS } from "@/lib/storage";

interface RecipeItemPayload {
  ingredientId: string;
  usageQty: number | string;
  usageUnit: string;
}

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        data: INITIAL_MENUS,
        source: "local-seed",
        message: "Menggunakan data lokal (DATABASE_URL belum dikonfigurasi)",
      });
    }

    // High performance query: single join with recipeItems to prevent N+1 queries
    const menus = await prisma.menuItem.findMany({
      include: {
        recipeItems: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    if (menus.length === 0) {
      return NextResponse.json({
        data: INITIAL_MENUS,
        source: "database-empty",
      });
    }

    return NextResponse.json({ data: menus, source: "database" });
  } catch (error) {
    console.error("Failed to fetch menus:", error);
    return NextResponse.json({
      data: INITIAL_MENUS,
      source: "fallback",
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const trimmedName = String(body.name || "").trim();

    if (!trimmedName) {
      return NextResponse.json(
        { error: "Nama menu tidak boleh kosong" },
        { status: 400 }
      );
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        data: { ...body, name: trimmedName },
        source: "mock-saved",
        message: "Tersimpan di local state",
      });
    }

    // Duplicate check: case-insensitive
    const existing = await prisma.menuItem.findFirst({
      where: {
        name: { equals: trimmedName, mode: "insensitive" },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Menu "${trimmedName}" sudah terdaftar.` },
        { status: 409 }
      );
    }

    // Transaction to safely create menu and its recipe items in 1 roundtrip
    const result = await prisma.$transaction(async (tx) => {
      const menu = await tx.menuItem.create({
        data: {
          name: trimmedName,
          category: body.category || "Makanan",
          description: body.description ? String(body.description).trim() : null,
          targetMarginDineIn: Number(body.targetMarginDineIn) || 65,
          overheadPercent: Number(body.overheadPercent) || 5,
          packagingOfflineCost: Number(body.packagingOfflineCost) || 500,
          packagingOnlineCost: Number(body.packagingOnlineCost) || 2500,
          manualOfflinePrice: body.manualOfflinePrice
            ? Number(body.manualOfflinePrice)
            : null,
        },
      });

      if (Array.isArray(body.recipeItems) && body.recipeItems.length > 0) {
        await tx.recipeItem.createMany({
          data: body.recipeItems.map((item: RecipeItemPayload) => ({
            menuItemId: menu.id,
            ingredientId: item.ingredientId,
            usageQty: Number(item.usageQty),
            usageUnit: item.usageUnit,
          })),
        });
      }

      return tx.menuItem.findUnique({
        where: { id: menu.id },
        include: {
          recipeItems: {
            include: { ingredient: true },
          },
        },
      });
    });

    return NextResponse.json({ data: result, success: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to save menu:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan resep menu" },
      { status: 500 }
    );
  }
}
