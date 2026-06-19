import { LeadsContent } from "@/components/dashboard/leads-content";
import { prisma } from "@/lib/prisma";
import type { LeadStatus, LeadSource } from "@/store/leads-store";
import type { Lead } from "@/app/dashboard/page";

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

  return <LeadsContent leads={leads} />;
}
