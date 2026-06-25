"use server"

import { prisma } from "../prisma"
import { revalidatePath } from "next/cache"

export async function updateEmailBody(id: number, body: string) {
  await prisma.email.update({
    where: { id },
    data: { body },
  })
}


export async function sendEmail(id: number) {
  const email = await prisma.email.findUnique({
    where: { id },
  })

  if (!email) return


  console.log(email)
}

export async function deleteEmail(id: number) {
  await prisma.email.delete({
    where: { id },
  });

  revalidatePath("/dashboard/emails");
}
