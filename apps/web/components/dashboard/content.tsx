"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { FilterSection } from "./filter-section";
import { StatsCards } from "./stats-cards";
import { MonthlyLeadGrowthChart } from "./monthly-lead-growth-chart";
import { LeadsByStatusChart } from "./leads-by-status-chart";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  FilterIcon,
  MoreHorizontalIcon,
  Invoice01Icon,
  Building01Icon,
} from "@hugeicons/core-free-icons";
import type { Lead } from "@/app/dashboard/page";
import type { LeadStatus, LeadSource } from "@/store/leads-store";

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

type SortBy = "newest" | "oldest" | "name_asc" | "name_desc";

interface DashboardContentProps {
  leads: Lead[];
}

export function DashboardContent({ leads }: DashboardContentProps) {
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortBy>("newest");

  // Filter and sort
  const filteredLeads = useMemo(() => {
    let result = leads;

    if (statusFilter !== "all") {
      result = result.filter((lead) => lead.status === statusFilter);
    }

    switch (sortBy) {
      case "newest":
        result = [...result].sort(
          (a, b) => b.createdTimestamp - a.createdTimestamp
        );
        break;
      case "oldest":
        result = [...result].sort(
          (a, b) => a.createdTimestamp - b.createdTimestamp
        );
        break;
      case "name_asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [leads, statusFilter, sortBy]);

  const hasActiveFilters = statusFilter !== "all";

  return (
    <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-background w-full">
      <FilterSection />
      <StatsCards />
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
        <MonthlyLeadGrowthChart />
        <LeadsByStatusChart />
      </div>

      {/* Recent Leads Table */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Recent Leads</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""}{" "}
              found
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" className="gap-2">
                  <HugeiconsIcon icon={FilterIcon} className="size-4" />
                  <span>
                    {statusFilter === "all"
                      ? "All Statuses"
                      : statusConfig[statusFilter].label}
                  </span>
                  {hasActiveFilters && (
                    <Badge
                      variant="secondary"
                      className="size-5 p-0 justify-center"
                    >
                      !
                    </Badge>
                  )}
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    className="size-4 text-muted-foreground"
                  />
                </Button>
              }
            />
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
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
                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                  Newest First {sortBy === "newest" ? "✓" : ""}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                  Oldest First {sortBy === "oldest" ? "✓" : ""}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name_asc")}>
                  Name (A-Z) {sortBy === "name_asc" ? "✓" : ""}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name_desc")}>
                  Name (Z-A) {sortBy === "name_desc" ? "✓" : ""}
                </DropdownMenuItem>
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
                <DropdownMenuItem
                  onClick={() => {
                    setStatusFilter("all");
                    setSortBy("newest");
                  }}
                >
                  Clear Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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


      </div>
    </main>
  );
}
