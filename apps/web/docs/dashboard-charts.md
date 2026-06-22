# Dashboard Charts — Architecture & Data Flow

## Overview

The dashboard (excluding the leads table) has **three** visualization components, all fed from a single data source:

```
page.tsx (server)
  │  prisma.lead.findMany({ include: { emails: true } })
  │
  └─► DashboardContent ({ leads })
        │
        ├─► StatsCards          ({ leads })   — 4 KPI cards
        ├─► MonthlyLeadGrowthChart ({ leads }) — time-series chart
        └─► LeadsByStatusChart  ({ leads })   — email status breakdown
```

---

## Data Model

```prisma
model Lead {
  id        Int      @id @default(autoincrement())
  name      String
  url       String?
  contact   String?  @unique
  profile   String?
  draft     String?
  emails    Email[]              // one-to-many
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Email {
  id        Int         @id @default(autoincrement())
  body      String
  status    EmailStatus @default(draft)   // draft | sent | failed
  lead      Lead?       @relation(fields: [leadId], references: [id])
  leadId    Int?
  createdAt DateTime    @default(now())
}
```

**TypeScript type** (`lib/types.ts`):

```ts
export type Lead = Awaited<
  ReturnType<typeof prisma.lead.findMany<{ include: { emails: true } }>>
>[number];

export interface LeadsProps {
  leads: Lead[];
}
```

So `leads` is an array where each element has the shape:

```ts
{
  id: number;
  name: string;
  url: string | null;
  contact: string | null;
  profile: string | null;
  draft: string | null;
  emails: { status: "draft" | "sent" | "failed"; body: string; ... }[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 1. StatsCards

**File:** `components/dashboard/stats-cards.tsx`  
**Purpose:** Four KPI cards showing aggregate lead/email metrics.

### Function: `StatsCards({ leads })`

Receives `leads: Lead[]` and builds a static `stats` array with four objects:

| # | Stat | Computation | What it counts |
|---|------|-------------|----------------|
| 1 | **Total Leads** | `leads.length` | Number of leads in the database |
| 2 | **Contacted Leads** | `leads.flatMap(l => l.emails).filter(e => e.status === "sent").length` | Total **sent** emails across all leads |
| 3 | **Delivered Emails** | `leads.flatMap(l => l.emails).filter(e => e.status === "sent").length` | Same as #2 (duplicate — likely needs update) |
| 4 | **Pending Drafts** | `leads.flatMap(l => l.emails).filter(e => e.status === "draft").length` | Total **draft** emails across all leads |

**Key array methods used:**

```
.flatMap(lead => lead.emails)   →  flattens nested email arrays into one
                                   [Lead¹.emails[], Lead².emails[], ...]
                                   → [Email, Email, Email, ...]

.filter(e => e.status === "X")  →  keeps only emails matching the status

.length                          →  counts results
```

### Data flow (internal)

```
leads: Lead[]
  │
  ├─ .length ───────► "Total Leads"
  ├─ .flatMap().filter("sent").length ──► "Contacted Leads"
  ├─ .flatMap().filter("sent").length ──► "Delivered Emails"
  └─ .flatMap().filter("draft").length ─► "Pending Drafts"
```

---

## 2. MonthlyLeadGrowthChart

**File:** `components/dashboard/monthly-lead-growth-chart.tsx`  
**Purpose:** Time-series chart (line / area / bar) showing leads created per month over the last 3, 6, or 12 months.  
**Chart library:** [Recharts](https://recharts.org)

### State

| State | Type | Default | Purpose |
|-------|------|---------|---------|
| `chartType` | `"line" \| "area" \| "bar"` | `"area"` | Switches between chart renderers |
| `period` | `"3m" \| "6m" \| "12m"` | `"12m"` | How many months of data to show |
| `showGrid` | `boolean` | `true` | Toggles the Cartesian grid |
| `smoothCurve` | `boolean` | `true` | Interpolation type: monotone vs linear |

### Functions

#### `chartData` (useMemo)

```ts
const chartData = useMemo(() => {
  const now = new Date();
  const months = [];

  for (let i = 11; i >= 0; i--) {
    // Create a date for the first day of each of the last 12 months
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

    // Count leads created in that month
    const count = leads.filter((lead) => {
      const created = new Date(lead.createdAt);
      return (
        created.getMonth() === d.getMonth() &&
        created.getFullYear() === d.getFullYear()
      );
    }).length;

    months.push({ month: "Jan/Feb/...", leads: count });
  }

  return months;  // [{ month: "Jan", leads: 5 }, { month: "Feb", leads: 12 }, ...]
}, [leads]);
```

**Recomputes whenever `leads` changes** (e.g., new lead added, page refresh).

Output shape: `{ month: string, leads: number }[]` — 12 entries, one per calendar month.

#### `getDataForPeriod()`

```ts
const getDataForPeriod = () => {
  switch (period) {
    case "3m":  return chartData.slice(-3);   // last 3 months
    case "6m":  return chartData.slice(-6);   // last 6 months
    case "12m": return chartData;             // all 12 months
  }
};
```

Called on every render (not memoized) because it depends on `period` state.

#### `yMax`

```ts
const maxLeads = Math.max(...data.map(d => d.leads), 1);
const yMax = Math.ceil(maxLeads / 100) * 100 + 100;
```

Computes a dynamic Y-axis ceiling:
1. Find the highest lead count in the visible data
2. Round up to the next hundred
3. Add 100 for padding

Example: max is `47` → `Math.ceil(47/100)*100 + 100` → `100 + 100` = `200`.

#### `resetToDefault()`

Resets all state to initial values.

#### `CustomTooltip({ active, payload })`

Rendered by Recharts on hover. Displays:
- Month name + year
- Lead count
- Same count repeated with an icon

### Chart rendering

Three mutually exclusive renders based on `chartType`:

```
chartType === "bar"   →  <BarChart>
chartType === "area"  →  <AreaChart>
else                  →  <LineChart>  (default fallback)
```

All three share the same `<XAxis>`, `<YAxis>`, `<CartesianGrid>`, and `<Tooltip>` configuration.

### Data flow

```
leads: Lead[]
  │
  └─ useMemo (chartData)
       │  Filter by createdAt month
       │  → [{ month: "Jan", leads: 5 }, ...12 entries]
       │
       └─ getDataForPeriod()
            │  slice(-3 / -6 / all)
            │
            └─ Recharts renders selected chart type
```

---

## 3. LeadsByStatusChart

**File:** `components/dashboard/leads-by-status-chart.tsx`  
**Purpose:** Horizontal bar chart showing email count breakdown by status. Despite its name, it shows **emails by status**, not leads.

### State

| State | Type | Default | Purpose |
|-------|------|---------|---------|
| `sortBy` | `"value_desc" \| "value_asc" \| "name_asc" \| "name_desc"` | `"value_desc"` | Sorting order |
| `visibleStatuses` | `Record<string, boolean>` | all `true` | Which status bars to show/hide |

### Functions

#### `statusData` (useMemo)

```ts
const statusData = useMemo(() => {
  // Flatten all emails from all leads into one array
  const allEmails = leads.flatMap(l => l.emails);

  // Count by status
  const draft  = allEmails.filter(e => e.status === "draft").length;
  const sent   = allEmails.filter(e => e.status === "sent").length;
  const failed = allEmails.filter(e => e.status === "failed").length;

  return [
    { name: "Draft",  value: draft,  color: "#ff9933" },
    { name: "Sent",   value: sent,   color: "#cc6600" },
    { name: "Failed", value: failed, color: "#a64d00" },
  ];
}, [leads]);
```

Recomputes when `leads` changes. Returns an array of `{ name, value, color }`.

#### `filteredAndSortedData` (useMemo)

1. **Filters** `statusData` to only include statuses where `visibleStatuses[name] === true`
2. **Sorts** by the selected `sortBy`:
   - `value_desc` / `value_asc` — numeric sort on `value`
   - `name_asc` / `name_desc` — alphabetical sort on `name`

#### `maxValue`

```ts
Math.max(...filteredAndSortedData.map(d => d.value), 1)
```

The largest visible value, used to compute bar widths as percentages. Minimum `1` to avoid division by zero.

#### `totalEmails` (useMemo)

```ts
leads.flatMap(l => l.emails).length
```

Total email count across all leads — displayed as the large number at the top.

#### `toggleStatus(name)`

Toggles a status on/off in `visibleStatuses`. When turned off, that bar disappears from the chart.

#### `resetToDefault()`

Resets sort to `value_desc` and shows all statuses.

### Bar width calculation

Each bar's width is proportionally calculated:

```ts
width: `${(item.value / maxValue) * 100}%`
```

So the largest category always fills 100% of the bar container, and smaller categories are scaled relative to it.

### Data flow

```
leads: Lead[]
  │
  ├─ flatMap(lead => lead.emails) ──► totalEmails (displayed at top)
  │
  └─ useMemo (statusData)
       │  flatMap → filter by status → count
       │  → [{ name: "Draft", value: 15 }, ...]
       │
       └─ useMemo (filteredAndSortedData)
            │  filter (visibleStatuses) → sort
            │
            └─ render bars with proportional widths
```

---

## Complete Dashboard Flow

```
┌─────────────────────────────────────────────────────────────┐
│  page.tsx (Server Component)                                │
│  prisma.lead.findMany({ include: { emails: true } })        │
│  → leads: Lead[]                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  DashboardContent ({ leads })                               │
│                                                             │
│  ┌───────────────┐  ┌──────────────────────┐  ┌──────────┐ │
│  │  StatsCards   │  │ MonthlyLeadGrowth    │  │ LeadsBy  │ │
│  │              │  │ Chart                │  │ Status   │ │
│  │  4 KPI cards │  │ Time-series chart    │  │ Chart    │ │
│  │              │  │ (line/area/bar)      │  │          │ │
│  │  - Total     │  │                      │  │ Emails   │ │
│  │  - Contacted │  │ 12 months → slice    │  │ by       │ │
│  │  - Delivered │  │ by period (3/6/12m)  │  │ status   │ │
│  │  - Drafts    │  │                      │  │ bars     │ │
│  └───────────────┘  └──────────────────────┘  └──────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Leads Table (not covered here)                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Array Methods Reference

| Method | Signature | Returns | Used in |
|--------|-----------|---------|---------|
| `.filter(fn)` | `(element) => boolean` | New array with passing elements | All components |
| `.flatMap(fn)` | `(element) => array` | Flattened array of fn results | StatsCards, LeadsByStatusChart |
| `.map(fn)` | `(element) => any` | New array of fn results | Chart data building, max calculation |
| `.sort(fn)` | `(a, b) => number` | Sorted array (mutates!) | LeadsByStatusChart |
| `.slice(start)` | `number` | Shallow copy of portion | MonthlyLeadGrowthChart (period filter) |
| `.reduce(fn, init)` | `(acc, el) => acc` | Single accumulated value | Not currently used but available |
| `.some(fn)` | `(element) => boolean` | `true` if any passes | Not currently used |
