"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  CircleCheck,
  CircleX,
  Clock,
  Eye,
  MailWarning,
  RefreshCw,
  Send,
} from "lucide-react";

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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type EmailStatus = "queued" | "sent" | "failed";

interface EmailRecord {
  id: string;
  from: string;
  to: string;
  subject: string;
  status: EmailStatus;
  sentAt: string;
}

// ---------------------------------------------------------------------------
// Status config — drives badge colour and icon per row
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Emails() {
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/email");
      if (!res.ok) throw new Error(`Failed to fetch emails (${res.status})`);
      const data = await res.json();
      setEmails(data.emails ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  // --- Loading skeleton ---
  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Emails</h1>
            <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
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
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Emails</h1>
          </div>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center">
          <MailWarning className="h-8 w-8 text-destructive mx-auto mb-3" />
          <p className="text-sm text-destructive font-medium mb-1">Failed to load emails</p>
          <p className="text-xs text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchEmails} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // --- Empty state ---
  if (emails.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Emails</h1>
            <p className="text-sm text-muted-foreground">No drafts yet</p>
          </div>
          <Button size="sm" className="gap-2" onClick={() => {}}>
            <Send className="h-3.5 w-3.5" />
            Generate drafts
          </Button>
        </div>
        <div className="rounded-lg border p-8 text-center">
          <Send className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No email drafts found. Generate drafts for your leads to see them here.
          </p>
        </div>
      </div>
    );
  }

  // --- Data ---
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
          <Button variant="outline" size="sm" className="gap-2" onClick={fetchEmails}>
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>

          <Button size="sm" className="gap-2" onClick={() => {}}>
            <Send className="h-3.5 w-3.5" />
            Send email
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
                <TableCell className="text-sm text-muted-foreground">
                  {email.from}
                </TableCell>
                <TableCell className="text-sm font-medium">{email.to}</TableCell>
                <TableCell className="text-sm max-w-64 truncate">
                  {email.subject}
                </TableCell>
                <TableCell>
                  <StatusBadge status={email.status} />
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                  {timeAgo(email.sentAt)}
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
