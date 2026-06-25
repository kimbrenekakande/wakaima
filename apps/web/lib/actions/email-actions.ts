"use server"

import { prisma } from "../prisma"

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