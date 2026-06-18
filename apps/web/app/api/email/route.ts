import { NextRequest, NextResponse } from "next/server";
import { leadReq } from "@/lib/types";
import AGENTIC_API_URL from "@/lib/service-url";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// POST — generate email drafts for leads via the agentic API
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  const body = await request.json();
  if (!body.leads)
    return NextResponse.json(
      { error: "Leads required to generate email drafts" },
      { status: 400 },
    );

  const drafts: any[] = [];

  for (const lead of body.leads) {
    const response = await fetch(`${AGENTIC_API_URL}/api/v1/lead`, {
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

// ---------------------------------------------------------------------------
// GET — list leads as email records for the email dashboard
// ---------------------------------------------------------------------------

type EmailStatus = "queued" | "sent" | "failed";

function deriveStatus(lead: {
  draft: string | null;
  contacted: boolean;
}): EmailStatus {
  if (lead.contacted) return "sent";
  if (lead.draft) return "queued";
  return "failed";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);
  const offset = Number(searchParams.get("offset")) || 0;

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where: { draft: { not: null } },
      orderBy: { updatedAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.lead.count({ where: { draft: { not: null } } }),
  ]);

  const emails = leads.map((lead) => ({
    id: `em_${lead.id}`,
    from: process.env.EMAIL_FROM_ADDRESS ?? "noreply@wakaima.com",
    to: lead.email ?? "unknown",
    subject: lead.draft?.split("\n")[0]?.replace(/^#+\s*/, "") ?? lead.name,
    status: deriveStatus(lead),
    sentAt: lead.updatedAt.toISOString(),
  }));

  return NextResponse.json({ emails, total });
}
