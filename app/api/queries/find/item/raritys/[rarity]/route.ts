import { prismaClient } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: any, { params }: any) {
  const { rarity } = params;

  if (!rarity) {
    return NextResponse.json(
      { error: "Rarity parameter is required" },
      { status: 400 }
    );
  }

  const normalizedRarity = rarity.toUpperCase();

  const items = await prismaClient.item.findMany({
    where: {
      rarity: normalizedRarity,
    },
  });

  return NextResponse.json({ items });
}
