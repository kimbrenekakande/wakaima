import { DashboardContent } from "@/components/dashboard/content";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const leads = await prisma.lead.findMany({
    include: { emails: true },
  });

  return (
    <>
      <div className="flex justify-between items-center mx-6 p-4  mb-4 border  border-orange-500 border-x-transparent">
        <p>Hang Tight, Generating Leads</p>
        <Button>Generating</Button>
      </div>
      <DashboardContent leads={leads} />;
    </>
  )
}
