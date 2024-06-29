import { prismaClient } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// Função para validar os dados de entrada
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, rarity, weight, epicness, type, defense, damage } = body;

    // Criação do item no Prisma
    const item = await prismaClient.item.create({
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

    return NextResponse.json({ item }, { status: 200 });
  } catch (error) {
    console.error("Erro ao criar item:", error);
    return NextResponse.json({ error: "Erro ao criar item" }, { status: 500 });
  }
}
