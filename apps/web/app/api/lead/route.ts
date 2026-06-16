import { NextRequest, NextResponse } from "next/server";
import { leadReq } from "@/lib/types";
import AGENTIC_API_URL from "@/lib/service-url";

export async function POST( request: Request) {
  const body = await request.json()

  if (!body.industry) return NextResponse.json({ error: 'Industry ID is required', status: 400 });
  if (!body.country) return NextResponse.json({ error: 'Country is required', status: 400 });

  const leadGen : leadReq = {
    industry: body.industry,
    country : body.country
  }

  const response = await fetch(`${AGENTIC_API_URL}/api/v1/lead`, {
    method: 'POST',
    headers: { "content-type": "application/json" },
    body: JSON.stringify(leadGen),
  })

  const results = await response.json()
  
  return NextResponse.json({"companies" : results.leads})
}