import { NextResponse } from "next/server";
import AGENTIC_API_URL from "@/lib/service-url";
import { prisma } from "@/lib/prisma";


export async function GET() {
  const leads = await prisma.lead.findMany()
  const companies = leads.map(({id, name, email, profile}) => ({id, name, email, profile }))

  const response = await fetch(`${AGENTIC_API_URL}/api/v1/email`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ "companies" : companies }),
  });

  const result = await response.json();

  console.log(result)

  if (!result.companies) return new NextResponse(null, { status: 500 });

  for (const company of result.companies) {
    await prisma.lead.update({
      where: { id : company.id },
      data: { draft: company.draft },
    });
  }

  return new NextResponse(null, { status: 201 });
}
