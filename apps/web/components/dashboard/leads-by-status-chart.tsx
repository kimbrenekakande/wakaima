"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Notification01Icon,
  MoreHorizontalIcon,
  ArrowDown01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import type { LeadsProps } from "@/lib/types";

type SortBy = "value_desc" | "value_asc" | "name_asc" | "name_desc";

interface StatusData {
  name: string;
  value: number;
  color: string;
}

const statusColors: Record<string, string> = {
  draft: "#ff9933",
  sent: "#cc6600",
  failed: "#a64d00",
};

export function LeadsByStatusChart({ leads }: LeadsProps) {
  const [sortBy, setSortBy] = useState<SortBy>("value_desc");
  const [visibleStatuses, setVisibleStatuses] = useState<
    Record<string, boolean>
  >({
    Draft: true,
    Sent: true,
    Failed: true,
  });

  // Count emails grouped by status
  const statusData: StatusData[] = useMemo(() => {
    const allEmails = leads.flatMap((l) => l.emails);

    const draft = allEmails.filter((e) => e.status === "draft").length;
    const sent = allEmails.filter((e) => e.status === "sent").length;
    const failed = allEmails.filter((e) => e.status === "failed").length;

    return [
      { name: "Draft", value: draft, color: statusColors.draft },
      { name: "Sent", value: sent, color: statusColors.sent },
      { name: "Failed", value: failed, color: statusColors.failed },
    ];
  }, [leads]);

  const filteredAndSortedData = useMemo(() => {
    let data = statusData.filter((item) => visibleStatuses[item.name]);

    switch (sortBy) {
      case "value_desc":
        data = [...data].sort((a, b) => b.value - a.value);
        break;
      case "value_asc":
        data = [...data].sort((a, b) => a.value - b.value);
        break;
      case "name_asc":
        data = [...data].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        data = [...data].sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return data;
  }, [statusData, sortBy, visibleStatuses]);

  const maxValue = useMemo(() => {
    return Math.max(...filteredAndSortedData.map((d) => d.value), 1);
  }, [filteredAndSortedData]);

  const totalEmails = useMemo(() => {
    return leads.flatMap((l) => l.emails).length;
  }, [leads]);

  const toggleStatus = (statusName: string) => {
    setVisibleStatuses((prev) => ({
      ...prev,
      [statusName]: !prev[statusName],
    }));
  };

  const resetToDefault = () => {
    setSortBy("value_desc");
    setVisibleStatuses({
      Draft: true,
      Sent: true,
      Failed: true,
    });
  };

  return (
    <div className="border rounded-xl w-full xl:w-[337px] shrink-0">
      <div className="flex flex-row items-center justify-between py-5 px-5">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="size-8">
            <HugeiconsIcon icon={Notification01Icon} className="size-4 text-muted-foreground" />
          </Button>
          <h3 className="font-medium text-sm sm:text-base">Emails by Status</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="size-8">
                <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 mr-2" />
                Sort By
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setSortBy("value_desc")}>
                  <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 mr-2" />
                  Value (High to Low) {sortBy === "value_desc" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("value_asc")}>
                  <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 mr-2 rotate-180" />
                  Value (Low to High) {sortBy === "value_asc" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name_asc")}>
                  <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 mr-2" />
                  Name (A to Z) {sortBy === "name_asc" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name_desc")}>
                  <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 mr-2 rotate-180" />
                  Name (Z to A) {sortBy === "name_desc" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <HugeiconsIcon icon={Notification01Icon} className="size-4 mr-2" />
                Show Statuses
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {statusData.map((item) => (
                  <DropdownMenuCheckboxItem
                    key={item.name}
                    checked={visibleStatuses[item.name]}
                    onCheckedChange={() => toggleStatus(item.name)}
                  >
                    <span
                      className="size-2 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={resetToDefault}>
              Reset to Default
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="px-5 pb-5 space-y-6 sm:space-y-8">
        <div className="flex items-end gap-2">
          <span className="text-2xl sm:text-[28px] font-semibold tracking-tight">
            {totalEmails.toLocaleString()}
          </span>
          <div className="flex items-center gap-2 text-xs sm:text-sm pb-1">
            <span className="text-muted-foreground hidden sm:inline">
              total emails
            </span>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {filteredAndSortedData.map((item) => (
            <div key={item.name} className="flex items-center gap-3 sm:gap-4">
              <span className="text-xs text-muted-foreground w-16 sm:w-[62px] shrink-0 truncate">
                {item.name}
              </span>
              <div className="flex-1 h-[15px] bg-muted rounded">
                <div
                  className="h-full rounded transition-all duration-300"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <span className="text-xs font-semibold w-10 sm:w-[30px] text-right shrink-0">
                {item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
