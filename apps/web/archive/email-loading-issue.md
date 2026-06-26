# Why Were Emails Loading Slowly While Leads Were Near Real-Time?

## The Problem

The **emails page** showed an empty table briefly before data appeared, while the **leads page** rendered with data instantly.

## Root Cause: Server Component vs Client Component

### Leads Page (`app/dashboard/leads/page.tsx`) — ✅ Near Real-Time

```tsx
// Server Component — no "use client" directive
export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({ include: { emails: true } });
  return <LeadsContent leads={leads} />;
}
```

**How it works:**
1. Browser requests `/dashboard/leads`
2. Next.js executes the `async` function **on the server**
3. `prisma.lead.findMany()` runs, fetches data from the database
4. The full HTML (with data) is sent to the browser in a single response
5. Browser renders the page **instantly with data** — no loading flash

### Emails Page (before fix) — ❌ Empty Flash

```tsx
"use client";  // Client Component

export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([]); // 👈 starts empty

  useEffect(() => {
    fetch("/api/emails")           // 👈 client-side fetch
      .then((res) => res.json())
      .then(setEmails);
  }, []);

  return (/* renders empty table, then populated table */);
}
```

**How it worked:**
1. Browser requests `/dashboard/emails`
2. Next.js sends the **shell HTML** (empty table, `emails = []`)
3. Browser renders the page **with no data** — empty flash ⚡
4. React mounts the component, triggers `useEffect`
5. Browser makes a **second request** to `/api/emails`
6. API handler queries Prisma, returns JSON
7. `setEmails(updated)` triggers a re-render with data

**Total: 2 HTTP round trips** — the empty state is visible between steps 3 and 7.

## The Fix

Converted the emails page to the same **server component pattern** as leads:

```tsx
// Server Component — no "use client"
export default async function EmailsPage() {
  const emails = await prisma.email.findMany({
    include: { lead: { select: { name: true, contact: true } } },
    orderBy: { createdAt: "desc" },
  });
  return <EmailsContent emails={emails} />;
}
```

All client-side interactivity (delete dialog, generate drafts, etc.) was moved to a separate `EmailsContent` client component that receives emails as props.

## Key Takeaways

| Pattern | Data at render | HTTP trips | User experience |
|---------|---------------|------------|-----------------|
| Server component + Prisma | ✅ Immediate | 1 | No loading flash |
| Client component + `useEffect` + `fetch` | ❌ Delayed | 2+ | Empty state visible |

**When to use which:**
- **Server component**: When data is available at request time (database queries, file reads). Prefer this for pages.
- **Client component + fetch**: When data depends on browser state (geolocation, localStorage) or needs real-time polling (WebSockets, SSE).
