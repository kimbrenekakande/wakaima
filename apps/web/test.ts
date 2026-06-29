import { prisma } from '@/lib/prisma'

const leads = await prisma.lead.findMany({
  include: {
    emails: true
  },
});

for (const lead of leads) {
  if (lead.contact) {
    if (lead.contact.includes('@')) console.log(lead.contact)
  }
}
