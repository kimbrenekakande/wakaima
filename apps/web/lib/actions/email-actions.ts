"use server"

import { prisma } from "../prisma"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

export async function updateEmailBody(id: number, body: string) {
  await prisma.email.update({
    where: { id },
    data: { body },
  })
}


export async function sendEmail(id: number, body?: string) {
  const headerStore = await headers()
  const host = headerStore.get("host") ?? "localhost:3000"
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
  const origin = `${protocol}://${host}`

  const res = await fetch(`${origin}/api/send/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error(err.error)
  }

  revalidatePath("/dashboard/emails")

  return res.json()
}

export async function deleteEmail(id: number) {
  await prisma.email.delete({
    where: { id },
  });

  revalidatePath("/dashboard/emails");
}
