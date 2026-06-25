import { LeadDetails } from "@/components/dashboard/lead-details";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id: parseInt(id) },
    include: { emails: true },
  });

  if (!lead) {
    notFound();
  }

  return (
    <LeadDetails
      lead={{
        id: lead.id,
        name: lead.name,
        url: lead.url,
        contact: lead.contact,
        profile: lead.profile,
        draft: lead.draft,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
        emails: lead.emails.map((e) => ({
          id: e.id,
          body: e.body,
          status: e.status,
          createdAt: e.createdAt,
        })),
      }}
    />
  );
}
