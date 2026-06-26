import { Resend } from 'resend';
import LeadEmail from '@/emails/eagle-lead';

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['kimbrenekakande@gmail.com'],
      subject: 'Hello world',
      react: await LeadEmail({ leadName: 'Eagle', url: 'https://eagle.ai' })
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
