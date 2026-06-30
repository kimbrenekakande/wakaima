"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Add01Icon, Invoice01Icon } from "@hugeicons/core-free-icons";
import { useLeadsStore, DateFilter } from "@/store/leads-store";
import { DotmSquare20 } from "@/components/ui/dotm-square-20";
import Link from "next/link";
import { useGenerating } from "@/lib/store";

const dateFilterLabels: Record<DateFilter, string> = {
  all: "All Time",
  today: "Today",
  yesterday: "Yesterday",
  last_7_days: "Last 7 Days",
  last_30_days: "Last 30 Days",
  this_month: "This Month",
};

export function FilterSection() {
  const { dateFilter, setDateFilter } = useLeadsStore();
  const { isGenerating } = useGenerating();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="gap-2">
              <span>{dateFilterLabels[dateFilter]}</span>
              <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 text-muted-foreground" />
            </Button>
          }
        />
        <DropdownMenuContent align="start">
          {Object.entries(dateFilterLabels).map(([key, label]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setDateFilter(key as DateFilter)}
              className={dateFilter === key ? "bg-accent" : ""}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-2 sm:gap-3">
        <DropdownMenu>
          <div className="flex items-center gap-2">
           {isGenerating && <DotmSquare20 color="#cc6600"/>}
          </div>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <HugeiconsIcon icon={Invoice01Icon} className="size-4 mr-2" />
              Import Leads
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon icon={Invoice01Icon} className="size-4 mr-2" />
              Export to CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon icon={Invoice01Icon} className="size-4 mr-2" />
              Export to Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href="/dashboard/form">
          <Button className="gap-2 bg-[#cc6600] hover:bg-[#b35900] text-white cursor-pointer">
            <HugeiconsIcon icon={Add01Icon} className="size-4" />
            {isGenerating ? <span className="mr-1">Generating</span> : <span>New leads</span>}
          </Button>
        </Link>
      </div>
    </div>
  );
}
