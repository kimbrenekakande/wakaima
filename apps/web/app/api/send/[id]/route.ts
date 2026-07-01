import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import LeadEmail from "@/emails/eagle-lead";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const emailId = parseInt(id, 10);

    if (isNaN(emailId)) {
      return NextResponse.json(
        { error: "Invalid email ID" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => null);
    const updatedBody: string | undefined = body?.body;

    const email = await prisma.email.findUnique({
      where: { id: emailId },
      include: { lead: true },
    });

    if (!email) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 404 }
      );
    }

    if (!email.lead) {
      return NextResponse.json(
        { error: "No lead associated with this email" },
        { status: 400 }
      );
    }

    if (!email.lead.contact?.includes("@")) {
      return NextResponse.json(
        { error: "Lead has no valid email address" },
        { status: 400 }
      );
    }

    if (updatedBody) {
      await prisma.email.update({
        where: { id: emailId },
        data: { body: updatedBody },.
      });
    }

    const draftBody = updatedBody ?? email.body;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "Eagle Info Solutions <sales@alerts.eagleinfosolutions.com>",
      to: email.lead.contact,
      subject: "Eagle Info Solutions",
      react: LeadEmail({ leadName: email.lead.name, draft: draftBody }),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: error.message || JSON.stringify(error) },
        { status: 500 }
      );
    }

    await prisma.email.update({
      where: { id: emailId },
      data: { status: "sent" },
    });

    return NextResponse.json(
      { message: `Email sent successfully to ${email.lead.name}`, data },
      { status: 200 }
    );
  } catch (err) {
    console.error("Send error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send email" },
      { status: 500 }
    );
  }
}
