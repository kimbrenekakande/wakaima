import { Resend } from 'resend';
import LeadEmail from '@/emails/eagle-lead';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        emails: true
      },
    });

    let sentCount = 0;

    for (const lead of leads) {
      if (!lead.emails || lead.emails.length === 0) continue;

      const drafts = lead.emails;
      let draft = drafts.find(d => d.status === 'draft');
      if (!draft) continue;

      if (lead.contact?.includes("@")) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
          from: 'Eagle Info Solutions <sales@alerts.eagleinfosolutions.com>',
          to: lead.contact,
          subject: 'Eagle Info Solutions',
          react: LeadEmail({ leadName: lead.name, draft: draft.body })
        });

        if (error) {
          console.error("Resend error:", error);
          return Response.json(
            { error: error.message || JSON.stringify(error) },
            { status: 500 }
          );
        }
        await prisma.email.update({
          where: { id: draft.id },
          data: { status: 'sent' }
        });
        sentCount++;
      }
    }

    return Response.json({ message: `Sent ${sentCount} emails successfully` }, { status: 200 });
  } catch (err) {
    console.error("Send error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to send emails" },
      { status: 500 }
    );
  }
}
