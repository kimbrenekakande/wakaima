"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Globe02Icon,
  Mail01Icon,
  Call02Icon,
  Location01Icon,
  Clock01Icon,
  Calendar02Icon,
  OfficeIcon,
  MoreHorizontalIcon,
  Delete01Icon,
  PencilEdit01Icon,
  Link01Icon,
  File01Icon,
  TimeHalfPassIcon,
} from "@hugeicons/core-free-icons";
import {
  parseProfile,
  extractContactInfo,
  extractStats,
  type ProfileSection,
  type ProfileLine,
} from "@/lib/profile-parser";

interface LeadEmail {
  id: number;
  body: string;
  status: string;
  createdAt: Date;
}

interface LeadDetailData {
  id: number;
  name: string;
  url: string | null;
  contact: string | null;
  profile: string | null;
  draft: string | null;
  createdAt: Date;
  updatedAt: Date;
  emails: LeadEmail[];
}

interface LeadDetailsProps {
  lead: LeadDetailData;
}

/** Format a URL for display (strip protocol, trailing slash) */
function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** Check if text is a URL */
function isUrl(text: string): boolean {
  return /^https?:\/\//i.test(text);
}

/** Render a single profile line */
function ProfileLineItem({ line }: { line: ProfileLine }) {
  if (line.type === "separator") {
    return <Separator className="my-3" />;
  }

  if (line.type === "bullet") {
    return (
      <li
        className="text-sm text-muted-foreground leading-relaxed"
        style={{ marginLeft: `${line.indent * 16}px` }}
      >
        {isUrl(line.text) ? (
          <a
            href={line.text}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            <HugeiconsIcon icon={Link01Icon} className="size-3 shrink-0" />
            {displayUrl(line.text)}
          </a>
        ) : (
          line.text
        )}
      </li>
    );
  }

  // Plain text
  return (
    <p className="text-sm text-muted-foreground leading-relaxed">
      {line.text}
    </p>
  );
}

/** Render a profile section */
function ProfileSectionCard({ section }: { section: ProfileSection }) {
  const hasBullets = section.lines.some((l) => l.type === "bullet");

  return (
    <div className="space-y-1.5">
      {section.title && (
        <h3
          className="font-semibold text-sm"
          style={{
            fontSize:
              section.level <= 1
                ? "1.05rem"
                : section.level === 2
                  ? "0.95rem"
                  : "0.875rem",
          }}
        >
          {section.title}
        </h3>
      )}
      {hasBullets ? (
        <ul className="space-y-0.5 list-none">
          {section.lines.map((line, i) => (
            <ProfileLineItem key={i} line={line} />
          ))}
        </ul>
      ) : (
        section.lines.map((line, i) => (
          <ProfileLineItem key={i} line={line} />
        ))
      )}
    </div>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LeadDetails({ lead }: LeadDetailsProps) {
  const sections = useMemo(() => parseProfile(lead.profile), [lead.profile]);
  const contactInfo = useMemo(() => extractContactInfo(sections), [sections]);
  const stats = useMemo(() => extractStats(sections), [sections]);

  // Merge extracted contact info from profile with DB-level contact
  const displayEmail = lead.contact || contactInfo?.email;
  const displayPhone = contactInfo?.phone;
  const displayAddress = contactInfo?.address;
  const displayHours = contactInfo?.hours;

  const hasContactInfo =
    displayEmail || displayPhone || displayAddress || displayHours || lead.url;

  const sentCount = lead.emails.filter((e) => e.status === "sent").length;
  const draftCount = lead.emails.filter((e) => e.status === "draft").length;
  const failedCount = lead.emails.filter((e) => e.status === "failed").length;
  const hasEmails = lead.emails.length > 0;

  return (
    <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-background w-full">
      {/* Back navigation */}
      <div>
        <Link href="/dashboard/leads">
          <Button variant="ghost" size="sm" className="gap-1.5 -ml-2">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            <span>Back to Leads</span>
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <HugeiconsIcon
                icon={OfficeIcon}
                className="size-5 text-muted-foreground"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight truncate">
                {lead.name}
              </h1>
              {lead.url && (
                <a
                  href={lead.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                >
                  <HugeiconsIcon icon={Globe02Icon} className="size-3.5 shrink-0" />
                  <span className="truncate">{displayUrl(lead.url)}</span>
                  <HugeiconsIcon icon={Link01Icon} className="size-3 shrink-0" />
                </a>
              )}
            </div>
          </div>

          {lead.draft && (
            <Badge variant="secondary" className="ml-13">
              Draft
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="gap-1.5">
            <HugeiconsIcon icon={PencilEdit01Icon} className="size-4" />
            <span>Edit</span>
          </Button>

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
                <HugeiconsIcon icon={PencilEdit01Icon} className="size-4 mr-2" />
                Edit Lead
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Mail01Icon} className="size-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <HugeiconsIcon icon={Delete01Icon} className="size-4 mr-2" />
                Delete Lead
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      {stats.length > 0 && (
        <div className="border rounded-xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 divide-y sm:divide-y-0 divide-border">
            {stats.slice(0, 4).map((stat, index) => (
              <div key={`stat-${index}`} className="p-4 sm:p-5 space-y-1.5">
                <p className="text-2xl sm:text-[28px] font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
        {/* Contact Information */}
        <div className="border rounded-xl flex-1">
          <div className="flex flex-row items-center justify-between py-5 px-5">
            <h3 className="font-medium text-sm sm:text-base">
              Contact Information
            </h3>
          </div>
          <div className="px-5 pb-5 space-y-3">
            {lead.url && (
              <div className="flex items-start gap-3">
                <HugeiconsIcon
                  icon={Globe02Icon}
                  className="size-4 text-muted-foreground shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs text-muted-foreground/60 font-medium">
                    Website
                  </p>
                  <a
                    href={lead.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {displayUrl(lead.url)}
                  </a>
                </div>
              </div>
            )}
            {displayAddress && (
              <div className="flex items-start gap-3">
                <HugeiconsIcon
                  icon={Location01Icon}
                  className="size-4 text-muted-foreground shrink-0 mt-0.5"
                />
                <p className="text-sm text-muted-foreground">
                  {displayAddress}
                </p>
              </div>
            )}
            {displayHours && (
              <div className="flex items-start gap-3">
                <HugeiconsIcon
                  icon={Clock01Icon}
                  className="size-4 text-muted-foreground shrink-0 mt-0.5"
                />
                <p className="text-sm text-muted-foreground">{displayHours}</p>
              </div>
            )}
            {displayEmail && (
              <div className="flex items-center gap-3">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  className="size-4 text-muted-foreground shrink-0"
                />
                <a
                  href={`mailto:${displayEmail}`}
                  className="text-sm text-primary hover:underline"
                >
                  {displayEmail}
                </a>
              </div>
            )}
            {displayPhone && (
              <div className="flex items-center gap-3">
                <HugeiconsIcon
                  icon={Call02Icon}
                  className="size-4 text-muted-foreground shrink-0"
                />
                <a
                  href={`tel:${displayPhone.replace(/\s/g, "")}`}
                  className="text-sm text-primary hover:underline"
                >
                  {displayPhone}
                </a>
              </div>
            )}
            {!hasContactInfo && (
              <p className="text-sm text-muted-foreground">
                No contact information available
              </p>
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="border rounded-xl flex-1">
          <div className="flex flex-row items-center justify-between py-5 px-5">
            <h3 className="font-medium text-sm sm:text-base">Quick Info</h3>
          </div>
          <div className="px-5 pb-5 space-y-3">
            {/* Emails summary */}
            {hasEmails && (
              <>
                <div className="flex items-center gap-3">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    className="size-4 text-emerald-500 shrink-0"
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground/60 font-medium">
                      Sent
                    </p>
                    <p className="text-sm font-semibold">{sentCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    className="size-4 text-amber-500 shrink-0"
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground/60 font-medium">
                      Drafts
                    </p>
                    <p className="text-sm font-semibold">{draftCount}</p>
                  </div>
                </div>
                {failedCount > 0 && (
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      className="size-4 text-destructive shrink-0"
                    />
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground/60 font-medium">
                        Failed
                      </p>
                      <p className="text-sm font-semibold">{failedCount}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Profile sections count */}
            {sections.length > 0 && (
              <div className="flex items-start gap-3">
                <HugeiconsIcon
                  icon={File01Icon}
                  className="size-4 text-muted-foreground shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs text-muted-foreground/60 font-medium">
                    Profile Sections
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {sections.filter((s) => s.title).length} sections extracted
                  </p>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="flex items-start gap-3">
              <HugeiconsIcon
                icon={Calendar02Icon}
                className="size-4 text-muted-foreground shrink-0 mt-0.5"
              />
              <div>
                <p className="text-xs text-muted-foreground/60 font-medium">
                  Created
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(lead.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HugeiconsIcon
                icon={TimeHalfPassIcon}
                className="size-4 text-muted-foreground shrink-0 mt-0.5"
              />
              <div>
                <p className="text-xs text-muted-foreground/60 font-medium">
                  Updated
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(lead.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Profile */}
      {sections.length > 0 && (
        <div className="border rounded-xl">
          <div className="flex flex-row items-center justify-between py-5 px-5">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="size-8">
                <HugeiconsIcon
                  icon={File01Icon}
                  className="size-4 text-muted-foreground"
                />
              </Button>
              <h3 className="font-medium text-sm sm:text-base">
                Company Profile
              </h3>
            </div>
          </div>
          <div className="px-5 pb-5">
            <div className="space-y-6">
              {sections.map((section, i) => (
                <ProfileSectionCard key={i} section={section} />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
