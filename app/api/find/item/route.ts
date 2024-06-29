import { prismaClient } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: any, res: any) {
  const items = await prismaClient.item.findMany();

  return NextResponse.json({ items });
}
