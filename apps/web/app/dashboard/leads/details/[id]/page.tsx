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
        name: lead.name,
        url: lead.url,
        contactUrl: null,
        email: null,
        profile: lead.profile,
        draft: lead.draft,
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
