"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteLead(id: number) {
  await prisma.lead.delete({
    where: { id },
  });

  revalidatePath("/dashboard/leads");
}
