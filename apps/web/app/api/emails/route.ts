
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import AGENTIC_API_URL from "@/lib/service-url";

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

export async function POST() {
  try {
    if (!AGENTIC_API_URL) {
      return NextResponse.json(
        { error: "AGENTIC_API_URL is not configured" },
        { status: 500 }
      );
    }

    const leads = await prisma.lead.findMany();
    const companies = leads.map(({ id, name, contact, profile }) => ({
      id,
      name,
      contact,
      profile,
    }));

    const response = await fetch(`${AGENTIC_API_URL}/api/v1/email`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.AGENTIC_API_KEY as string,
      },
      body: JSON.stringify({ companies }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `External API returned ${response.status}` },
        { status: 502 }
      );
    }

    const result = await response.json();

    if (!result.companies) {
      return NextResponse.json(
        { error: "No companies in response" },
        { status: 500 }
      );
    }

    for (const company of result.companies) {
      await prisma.lead.update({
        where: { id: company.id },
        data: {
          emails: {
            create: { body: company.draft },
          },
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Email route error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
