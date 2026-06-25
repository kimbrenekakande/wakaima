import {prisma} from "@/lib/prisma"

export interface leadReq {
  industry  : string
  country: string
}


export type Lead = Awaited<
  ReturnType<typeof prisma.lead.findMany<{ include: { emails: true } }>>
  >[number];


export interface LeadsProps {
  leads: Lead[];
}
