import { NextRequest, NextResponse } from "next/server";
import { leadReq } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import AGENTIC_API_URL from "@/lib/service-url";

export async function POST( request: Request) {
  try {
    const body = await request.json()

    if (!body.industry) return NextResponse.json({ error: 'Industry ID is required', status: 400 });
    if (!body.country) return NextResponse.json({ error: 'Country is required', status: 400 });

    if (!AGENTIC_API_URL) {
      return NextResponse.json(
        { error: "AGENTIC_API_URL is not configured" },
        { status: 500 }
      );
    }

    const leadGen : leadReq = {
      industry: body.industry,
      country: body.country,
    }
    const x = await fetch(`${AGENTIC_API_URL}/api/v1/lead`, {
      method: 'POST',
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.AGENTIC_API_KEY as string
      },
      body: JSON.stringify(leadGen),
    })

    if (!x.ok) {
      const errorBody = await x.json().catch(() => null);
      return NextResponse.json(
        { error: `External API returned ${x.status}`, details: errorBody },
        { status: 502 }
      );
    }

    const response = await x.json()

    if (!response.leads?.length) {
      return NextResponse.json(
        { error: "No leads returned from external API" },
        { status: 502 }
      );
    }

    let created = 0;
    for (const lead of response.leads) {
      await prisma.lead.create({
        data: {
          name :  lead.name,
          url  :  lead.url,
          contact : lead.email,
          profile : lead.profile
        }
      })
      created++
    }

    return NextResponse.json({ leads_created: created })
  } catch (error) {
    console.error("POST /api/lead error:", error);
    return NextResponse.json(
      { error: "Internal server error", status: 500 },
      { status: 500 }
    );
  }
}
