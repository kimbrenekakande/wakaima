import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const emails = await prisma.email.findMany({
    include: {
      lead: {
        select: { name: true, contact : true }
      }
    },
  });
  return NextResponse.json(emails);
}
