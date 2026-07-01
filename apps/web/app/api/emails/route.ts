
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

// ── Config ──────────────────────────────────────────────────────────────

/**
 * Maximum time (ms) to wait for the external AI service to generate drafts
 * for a single batch. Keep this well under Cloudflare's 100 s proxy timeout.
 */
const AI_TIMEOUT_MS = 75_000;

/**
 * Number of leads to send to the AI service per request.
 * Splitting into chunks prevents a single slow generation from blocking
 * everything and keeps each chunk comfortably within the timeout.
 */
const CHUNK_SIZE = 5;

// ── Helpers ─────────────────────────────────────────────────────────────

/**
 * Fetch with a configurable timeout. Rejects with a descriptive error
 * when the AI service takes too long.
 */
async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Send one chunk of companies to the AI service and persist the returned
 * drafts. Returns the number of drafts created.
 */
async function processChunk(
  companies: { id: number; name: string; contact: string | null; profile: string | null }[],
): Promise<number> {
  const url = `${AGENTIC_API_URL!}/api/v1/email`;
  const response = await fetchWithTimeout(
    url,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.AGENTIC_API_KEY as string,
      },
      body: JSON.stringify({ companies }),
    },
    AI_TIMEOUT_MS,
  );

  if (!response.ok) {
    throw new Error(`External API returned ${response.status}`);
  }

  const result = await response.json();

  if (!result.companies || !Array.isArray(result.companies)) {
    throw new Error("No companies in response");
  }

  // Persist all drafts in parallel rather than sequentially
  await Promise.all(
    result.companies.map((company: { id: number; draft: string }) =>
      prisma.lead.update({
        where: { id: company.id },
        data: {
          emails: {
            create: { body: company.draft },
          },
        },
      }),
    ),
  );

  return result.companies.length;
}

// ── Route handler ───────────────────────────────────────────────────────

export async function POST() {
  try {
    if (!AGENTIC_API_URL) {
      return NextResponse.json(
        { error: "AGENTIC_API_URL is not configured" },
        { status: 500 },
      );
    }

    const leads = await prisma.lead.findMany();

    if (leads.length === 0) {
      return NextResponse.json({ success: true, drafts: 0 }, { status: 200 });
    }

    const companies = leads.map(({ id, name, contact, profile }) => ({
      id,
      name,
      contact,
      profile,
    }));

    // Split into chunks so no single HTTP request runs past the timeout
    let totalDrafts = 0;
    const errors: string[] = [];

    for (let i = 0; i < companies.length; i += CHUNK_SIZE) {
      const chunk = companies.slice(i, i + CHUNK_SIZE);
      try {
        const count = await processChunk(chunk);
        totalDrafts += count;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error(`Chunk ${i / CHUNK_SIZE + 1} failed:`, msg);
        errors.push(`Chunk starting at lead ${chunk[0].name}: ${msg}`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: true,
          drafts: totalDrafts,
          warnings: errors,
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      { success: true, drafts: totalDrafts },
      { status: 201 },
    );
  } catch (error) {
    console.error("Email route error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
