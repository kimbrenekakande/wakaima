import { prisma } from "./lib/prisma";

const leads = await prisma.email.findMany()

console.log(leads)