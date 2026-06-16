import { DashboardContent } from "@/components/dashboard/content";
import { prisma } from "@/lib/prisma";
import type { LeadStatus, LeadSource } from "@/store/leads-store";

export interface Lead {
  id: string;
  leadId: string;
  name: string;
  email: string;
  avatar: string;
  status: LeadStatus;
  source: LeadSource;
  owner: string;
  ownerInitials: string;
  createdAt: string;
  createdTimestamp: number;
}

export default async function DashboardPage() {
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

  return <DashboardContent leads={leads} />;
}
