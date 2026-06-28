"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Add01Icon,
  Mail01Icon,
  FilterIcon,
  MoreHorizontalIcon,
  Search01Icon,
  Tick01Icon,
  Cancel01Icon,
  Delete01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { deleteEmail } from "@/lib/actions/email-actions";

interface Email {
  id: number;
  body: string;
  status: string;
  leadId: number | null;
  lead: { name: string; contact: string | null } | null;
  createdAt: Date;
}

interface EmailsContentProps {
  emails: Email[];
}

function stripMarkdown(md: string): string {
  return md
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/^[*-]\s/gm, "")
    .replace(/^\d+\.\s/gm, "")
    .replace(/^>\s/gm, "")
    .replace(/^[-=*_]{3,}\s*$/gm, "")
    .replace(/\n+/g, " ")
    .trim();
}

export function EmailsContent({ emails }: EmailsContentProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDrafts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/emails", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Server error: ${res.status}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate drafts");
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-background w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold">Emails</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your email campaigns and templates
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" className="gap-2">
                  <span>Bulk Actions</span>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className="size-4 text-muted-foreground"
                  />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <HugeiconsIcon icon={Tick01Icon} className="size-4 mr-2" />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Mail01Icon} className="size-4 mr-2" />
                Archive Selected
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Delete01Icon} className="size-4 mr-2" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={generateDrafts}
            disabled={loading}
            className="gap-2 bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
          >
            <HugeiconsIcon icon={Add01Icon} className="size-4" />
            <span>{loading ? "Generating..." : "New Drafts"}</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className="gap-2">
                <HugeiconsIcon icon={FilterIcon} className="size-4" />
                <span>All Statuses</span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  className="size-4 text-muted-foreground"
                />
              </Button>
            }
          />
          <DropdownMenuContent align="start">
            <DropdownMenuItem>All Statuses</DropdownMenuItem>
            <DropdownMenuItem>Sent</DropdownMenuItem>
            <DropdownMenuItem>Draft</DropdownMenuItem>
            <DropdownMenuItem>Scheduled</DropdownMenuItem>
            <DropdownMenuItem>Failed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" className="gap-2">
                  <span>Sort by</span>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className="size-4 text-muted-foreground"
                  />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Newest First</DropdownMenuItem>
              <DropdownMenuItem>Oldest First</DropdownMenuItem>
              <DropdownMenuItem>Budget: High to Low</DropdownMenuItem>
              <DropdownMenuItem>Budget: Low to High</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="icon" className="size-9">
                  <HugeiconsIcon
                    icon={MoreHorizontalIcon}
                    className="size-4"
                  />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <HugeiconsIcon icon={Search01Icon} className="size-4 mr-2" />
                Search Emails
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Cancel01Icon} className="size-4 mr-2" />
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableCaption>Current Lead Email Queue.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Ref</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Lead</TableHead>
            <TableHead className="text-right">Contact</TableHead>
            <TableHead className="text-right">Created</TableHead>
            <TableHead className="w-10 text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.map((email) => (
            <TableRow key={email.id}>
              <TableCell>
                <Link href={`/dashboard/emails/editor/${email.id}`}>
                  <div className="flex items-center gap-2 max-w-xs">
                    <HugeiconsIcon icon={Mail01Icon} className="size-5 text-muted-foreground shrink-0" />
                    <span className="font-medium truncate min-w-0">{stripMarkdown(email.body)}</span>
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  <span
                    aria-hidden="true"
                    className={`size-1.5 rounded-full ${
                      email.status === "sent"
                        ? "bg-emerald-500"
                        : email.status === "failed"
                          ? "bg-red-500"
                          : "bg-muted-foreground/64"
                    }`}
                  />
                  {email.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{email.lead?.name ?? "-"}</TableCell>
              <TableCell className="text-right">{email.lead?.contact ?? "-"}</TableCell>
              <TableCell className="text-right">{email.createdAt.toLocaleDateString()}</TableCell>
              <TableCell className="flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        disabled={deletingId === email.id}
                      >
                        <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                      </Button>
                    }
                  />
                  <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Email</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this email?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        disabled={deletingId === email.id}
                        onClick={async () => {
                          setDeletingId(email.id);
                          await deleteEmail(email.id);
                          setDeletingId(null);
                          router.refresh();
                        }}
                      >
                        {deletingId === email.id ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            {/*<TableCell colSpan={4}>Total Emails</TableCell>
            <TableCell className="text-right">{emails.length}</TableCell>*/}
          </TableRow>
        </TableFooter>
      </Table>
    </main>
  );
}
