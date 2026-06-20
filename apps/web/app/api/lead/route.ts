import { NextRequest, NextResponse } from "next/server";
import { leadReq } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import AGENTIC_API_URL from "@/lib/service-url";

export async function POST( request: Request) {
  try {
    const body = await request.json()

    if (!body.industry) return NextResponse.json({ error: 'Industry ID is required', status: 400 });
    if (!body.country) return NextResponse.json({ error: 'Country is required', status: 400 });

    const leadGen : leadReq = {
      industry: body.industry,
      country : body.country
    }

    const x = await fetch(`${AGENTIC_API_URL}/api/v1/lead`, {
      method: 'POST',
      headers: { "content-type": "application/json" },
      body: JSON.stringify(leadGen),
    })

    const response = await x.json()


    for (const lead of response.leads) {
      const l = await prisma.lead.create({
        data: {
          name :  lead.name,
          url  :  lead.url,
          contact : lead.email,
          profile : lead.profile
        }
      })
    }

    return NextResponse.json({"companies" : "created"})
  } catch (error) {
    console.error("POST /api/lead error:", error);
    return NextResponse.json(
      { error: "Internal server error", status: 500 },
      { status: 500 }
    );
  }
}
