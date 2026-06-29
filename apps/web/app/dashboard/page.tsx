import { DashboardContent } from "@/components/dashboard/content";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const leads = await prisma.lead.findMany({
    include: { emails: true },
  });

  return (
    <>
      <DashboardContent leads={leads} />
    </>
  )
}
