import { prismaClient } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    // Extrair dados do item a partir do request body
    const body = await request.json();
    const { id, name, rarity, weight, epicness, type, defense, damage } = body;

    // Atualizar o item no banco de dados
    const updatedItem = await prismaClient.item.update({
      where: { id },
      data: {
        name,
        rarity,
        weight,
        epicness,
        type,
        defense,
        damage,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}
