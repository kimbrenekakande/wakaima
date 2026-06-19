import { prisma } from "./lib/prisma";

const leads = await prisma.lead.findMany()
const cleaned = leads.map(({ name, email, profile }) => ({ name, email, profile }))

console.log(leads)