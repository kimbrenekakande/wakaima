"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilterSection } from "./filter-section";
import { StatsCards } from "./stats-cards";
import { MonthlyLeadGrowthChart } from "./monthly-lead-growth-chart";
import { LeadsByStatusChart } from "./leads-by-status-chart";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  MoreHorizontalIcon,
  Invoice01Icon,
  OfficeIcon,
} from "@hugeicons/core-free-icons";
import type { LeadsProps } from "@/lib/types";

type SortBy = "newest" | "oldest" | "name_asc" | "name_desc";


export function DashboardContent({ leads }: LeadsProps) {
  const [sortBy, setSortBy] = useState<SortBy>("newest");

  // Sort
  const sortedLeads = useMemo(() => {
    const result = [...leads];

    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        );
        break;
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [leads, sortBy]);

  return (
    <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-background w-full">
      <FilterSection />
      <StatsCards leads={leads} />
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
        <MonthlyLeadGrowthChart leads={leads} />
        <LeadsByStatusChart leads={leads} />
      </div>

      {/* Recent Leads Table */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Recent Leads</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {sortedLeads.length} lead{sortedLeads.length !== 1 ? "s" : ""}{" "}
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
        <div className="flex items-center justify-end gap-2 sm:gap-3 mb-4">
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
                  setSortBy("newest");
                }}
              >
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">URL</TableHead>
                <TableHead className="hidden sm:table-cell">Contact</TableHead>
                <TableHead>Emails</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLeads.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No leads found
                  </TableCell>
                </TableRow>
              ) : (
                sortedLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Link href={`/dashboard/leads/details/${lead.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <HugeiconsIcon icon={OfficeIcon} className="size-5 text-muted-foreground shrink-0" />
                        <span className="font-medium text-sm">{lead.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {lead.url ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {lead.contact ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {lead.emails.length}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {lead.createdAt.toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="size-7">
                              <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4 text-muted-foreground" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete Lead</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
