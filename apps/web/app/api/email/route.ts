import { NextResponse } from "next/server";
import AGENTIC_API_URL from "@/lib/service-url";
import { prisma } from "@/lib/prisma";


export async function POST(request: Request) {
  const body = await request.json();
  if (!body.leads)
    return NextResponse.json(
      { error: "Leads required to generate email drafts" },
      { status: 400 },
    );

  const drafts: any[] = [];

  for (const lead of body.leads) {
    const response = await fetch(`${AGENTIC_API_URL}/api/v1/email`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(lead),
    });

    const result = await response.json();
    if (!result.draft) return new NextResponse(null, { status: 500 });

    drafts.push(result.draft);
  }

  for (const draft of drafts) {
    await prisma.lead.update({
      where: { id: draft.id },
      data: { draft: draft.message },
    });
  }

  return new NextResponse(null, { status: 201 });
}
