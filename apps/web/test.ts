import { prisma } from "./lib/prisma";

const draft = await prisma.email.findUnique({
  where: { id: 6 },
});

console.log(draft)