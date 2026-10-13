import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { INITIAL_INGREDIENTS } from "@/lib/storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q")?.trim() || "";

    if (!process.env.DATABASE_URL) {
      const filtered = search
        ? INITIAL_INGREDIENTS.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
        : INITIAL_INGREDIENTS;

      return NextResponse.json({
        data: filtered,
        source: "local-seed",
        message: "Menggunakan data lokal (DATABASE_URL belum dikonfigurasi)",
      });
    }

    const whereClause = search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : undefined;

    const ingredients = await prisma.ingredient.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
    });

    if (ingredients.length === 0 && !search) {
      // Seed if empty initially
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
    // Log real error internally on server, avoid leaking sensitive stack traces
    console.error("Failed to fetch ingredients:", error);
    return NextResponse.json({
      data: INITIAL_INGREDIENTS,
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
        { error: "Nama bahan baku tidak boleh kosong" },
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
    const existing = await prisma.ingredient.findFirst({
      where: {
        name: { equals: trimmedName, mode: "insensitive" },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Bahan "${trimmedName}" sudah terdaftar di master data.` },
        { status: 409 }
      );
    }

    const created = await prisma.ingredient.create({
      data: {
        name: trimmedName,
        category: body.category || "BAHAN_BAKU",
        purchasePrice: Number(body.purchasePrice) || 0,
        purchaseQty: Number(body.purchaseQty) || 1,
        purchaseUnit: body.purchaseUnit || "KG",
        yieldPercent: Number(body.yieldPercent) || 100,
      },
    });

    return NextResponse.json({ data: created, success: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to create ingredient:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan bahan baku" },
      { status: 500 }
    );
  }
}
