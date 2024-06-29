import { prismaClient } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: any, { params }: any) {
  const { type } = params;

  if (!type) {
    return NextResponse.json(
      { error: "type parameter is required" },
      { status: 400 }
    );
  }

  const normalizedType = type.toUpperCase(); // Normaliza o tipo para maiúsculas

  const items = await prismaClient.item.findMany({
    where: {
      type: normalizedType,
    },
  });

  return NextResponse.json({ items });
}
