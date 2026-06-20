import { LeadsContent } from "@/components/dashboard/leads-content";
import { prisma } from "@/lib/prisma";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    include : {emails : true },
  });

  return <LeadsContent leads={leads} />;
}
