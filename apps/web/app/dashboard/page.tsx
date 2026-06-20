import { DashboardContent } from "@/components/dashboard/content";
import { prisma } from "@/lib/prisma";

export type Lead = Awaited<
  ReturnType<typeof prisma.lead.findMany<{ include: { emails: true } }>>
>[number];

export default async function DashboardPage() {
  const leads = await prisma.lead.findMany({
    include: { emails: true },
  });

  return <DashboardContent leads={leads} />;
}
