"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  FilterIcon,
  MoreHorizontalIcon,
  Search01Icon,
  Invoice01Icon,
  Settings01Icon,
  Building01Icon,
} from "@hugeicons/core-free-icons";
import {
  useLeadsStore,
  LeadStatus,
  LeadSource,
} from "@/store/leads-store";
import type { Lead } from "@/app/dashboard/page";

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: {
    label: "New Leads",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  contacted: {
    label: "Contacted",
    className:
      "bg-orange-100 text-orange-800 dark:bg-orange-950/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  },
  qualified: {
    label: "Qualified",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  negotiation: {
    label: "Negotiation",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  inactive: {
    label: "Inactive",
    className:
      "bg-gray-100 text-gray-800 dark:bg-gray-950/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
  },
  recycled: {
    label: "Recycled",
    className:
      "bg-pink-100 text-pink-800 dark:bg-pink-950/30 dark:text-pink-400 border-pink-200 dark:border-pink-800",
  },
};

const sourceLabels: Record<LeadSource, string> = {
  website: "Website",
  paid_ads: "Paid Ads",
  referral: "Referral",
  social: "Social",
  email: "Email",
};

interface LeadsContentProps {
  leads: Lead[];
}

export function LeadsContent({ leads }: LeadsContentProps) {
  const {
    searchQuery,
    statusFilter,
    sourceFilter,
    ownerFilter,
    setSearchQuery,
    setStatusFilter,
    setSourceFilter,
    setOwnerFilter,
    clearFilters,
  } = useLeadsStore();

  const owners = useMemo(() => {
    return [...new Set(leads.map((lead) => lead.owner))];
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        searchQuery === "" ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.leadId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;
      const matchesSource =
        sourceFilter === "all" || lead.source === sourceFilter;
      const matchesOwner = ownerFilter === "all" || lead.owner === ownerFilter;

      return matchesSearch && matchesStatus && matchesSource && matchesOwner;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter, ownerFilter]);

  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "all" ||
    sourceFilter !== "all" ||
    ownerFilter !== "all";

  return (
    <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-background w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold">All Leads</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filteredLeads.length} lead
            {filteredLeads.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" className="gap-2">
                  <HugeiconsIcon icon={Invoice01Icon} className="size-4" />
                  <span>Import/Export</span>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className="size-4 text-muted-foreground"
                  />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Import Leads</DropdownMenuItem>
              <DropdownMenuItem>Export to CSV</DropdownMenuItem>
              <DropdownMenuItem>Export to Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 w-full sm:w-[200px]"
            />
          </div>

          {/* Status filter */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" className="gap-2 h-9">
                  <span>
                    {statusFilter === "all"
                      ? "All Statuses"
                      : statusConfig[statusFilter].label}
                  </span>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className="size-4 text-muted-foreground"
                  />
                </Button>
              }
            />
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => setStatusFilter("all")}
                className={statusFilter === "all" ? "bg-accent" : ""}
              >
                All Statuses
              </DropdownMenuItem>
              {Object.entries(statusConfig).map(([key, { label }]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setStatusFilter(key as LeadStatus)}
                  className={statusFilter === key ? "bg-accent" : ""}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Source filter */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" className="gap-2 h-9">
                  <span>
                    {sourceFilter === "all"
                      ? "All Sources"
                      : sourceLabels[sourceFilter]}
                  </span>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className="size-4 text-muted-foreground"
                  />
                </Button>
              }
            />
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => setSourceFilter("all")}
                className={sourceFilter === "all" ? "bg-accent" : ""}
              >
                All Sources
              </DropdownMenuItem>
              {Object.entries(sourceLabels).map(([key, label]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setSourceFilter(key as LeadSource)}
                  className={sourceFilter === key ? "bg-accent" : ""}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Owner filter */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" className="gap-2 h-9">
                  <span>
                    {ownerFilter === "all" ? "All Owners" : ownerFilter}
                  </span>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className="size-4 text-muted-foreground"
                  />
                </Button>
              }
            />
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => setOwnerFilter("all")}
                className={ownerFilter === "all" ? "bg-accent" : ""}
              >
                All Owners
              </DropdownMenuItem>
              {owners.map((owner) => (
                <DropdownMenuItem
                  key={owner}
                  onClick={() => setOwnerFilter(owner)}
                  className={ownerFilter === owner ? "bg-accent" : ""}
                >
                  {owner}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 text-muted-foreground"
              onClick={clearFilters}
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Source</TableHead>
              <TableHead>Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8"
                >
                  No leads found
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={Building01Icon} className="size-5 text-muted-foreground shrink-0" />
                      <span className="font-medium text-sm">{lead.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {lead.email}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${statusConfig[lead.status].className}`}
                    >
                      {statusConfig[lead.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {sourceLabels[lead.source]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{lead.owner}</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
