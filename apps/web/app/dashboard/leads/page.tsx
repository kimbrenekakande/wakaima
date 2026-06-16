import { prisma } from "@/lib/prisma";
import { LeadsTable } from "@/components/dashboard/leads-table";
import type { LeadStatus, LeadSource } from "@/store/leads-store";
import type { Lead } from "@/app/dashboard/page";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon } from "@hugeicons/core-free-icons";

export default async function LeadsPage() {
  const rawLeads = await prisma.lead.findMany();
  const leads: Lead[] = rawLeads.map((raw) => ({
    id: String(raw.id),
    leadId: `LD${String(raw.id).padStart(4, "0")}`,
    name: raw.name,
    email: raw.email ?? "",
    avatar: "",
    status: "new" as LeadStatus,
    source: "website" as LeadSource,
    owner: "Unassigned",
    ownerInitials: "UN",
    createdAt: "",
    createdTimestamp: 0,
  }));

  return (
    <main className="min-h-0 flex-1 w-full overflow-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-background">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
            Leads
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and track all your leads in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50">
            <HugeiconsIcon
              icon={UserGroupIcon}
              className="size-4 text-muted-foreground"
            />
            <span className="text-sm font-medium">{leads.length} leads</span>
          </div>
        </div>
      </div>

      <LeadsTable leads={leads} />
    </main>
  );
}
