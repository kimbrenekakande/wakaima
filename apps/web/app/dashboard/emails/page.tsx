import { EmailsContent } from "@/components/dashboard/emails-content";
import { prisma } from "@/lib/prisma";

export default async function EmailsPage() {
  const emails = await prisma.email.findMany({
    include: { lead: { select: { name: true, contact: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <EmailsContent
      emails={emails.map((e) => ({
        id: e.id,
        body: e.body,
        status: e.status,
        leadId: e.leadId,
        lead: e.lead,
        createdAt: e.createdAt.toLocaleDateString("en-US"),
      }))}
    />
  );
}
