"use server"

import { prisma } from "../prisma"

export async function updateEmailBody(id: number, body: string) {
  await prisma.email.update({
    where: { id },
    data: { body },
  })
}
