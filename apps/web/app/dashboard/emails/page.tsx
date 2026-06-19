"use client";

import { useCallback, useState } from "react";
import { ArrowUpRight, CircleX, Clock, RefreshCw, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type EmailStatus = "queued" | "sent" | "failed";

interface EmailRecord {
  id: string;
  from: string;
  to: string;
  subject: string;
  status: EmailStatus;
  sentAt: string;
}

const STATUS_CONFIG: Record<
  EmailStatus,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  sent: {
    label: "Sent",
    icon: Send,
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900",
  },
  queued: {
    label: "Queued",
    icon: Clock,
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
  },
  failed: {
    label: "Failed",
    icon: CircleX,
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900",
  },
};

const defaultEmails: EmailRecord[] = [
  {
    id: "em_1",
    from: "noreply@wakaima.com",
    to: "alice@acme.com",
    subject: "Following up on our call",
    status: "sent",
    sentAt: "2026-06-19T10:59:47.000Z",
  },
  {
    id: "em_2",
    from: "noreply@wakaima.com",
    to: "bob@globex.com",
    subject: "Excited to connect",
    status: "queued",
    sentAt: "2026-06-19T09:09:47.000Z",
  },
  {
    id: "em_3",
    from: "noreply@wakaima.com",
    to: "carol@initech.com",
    subject: "Your demo is ready",
    status: "failed",
    sentAt: "2026-06-16T11:09:47.000Z",
  },
];

function StatusBadge({ status }: { status: EmailStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.sent;
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={`gap-1.5 font-normal ${config.className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

export default function Emails() {
  const [emails, setEmails] = useState<EmailRecord[]>(defaultEmails);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/email");
      if (!res.ok) return;
      const data = await res.json();
      setEmails(data.emails ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateDrafts = useCallback(async () => {
    setLoading(true);
    try {
      await fetch("/api/email", { method: "GET" });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Emails</h1>
          <p className="text-sm text-muted-foreground">
            {emails.length} draft{emails.length !== 1 ? "s" : ""} ready
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            className="gap-2"
            onClick={generateDrafts}
            disabled={loading}
          >
            <Send className="h-3.5 w-3.5" />
            Generate drafts
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Sent</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {emails.map((email) => (
              <TableRow key={email.id} className="group cursor-pointer">
                <TableCell className="text-sm text-muted-foreground">{email.from}</TableCell>
                <TableCell className="text-sm font-medium">{email.to}</TableCell>
                <TableCell className="text-sm max-w-64 truncate">{email.subject}</TableCell>
                <TableCell>
                  <StatusBadge status={email.status} />
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                  {email.sentAt}
                </TableCell>
                <TableCell>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
