"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Invoice01Icon, UserGroupIcon, Mail01Icon, File02Icon } from "@hugeicons/core-free-icons";
import { LeadsProps } from "@/lib/types";

export function StatsCards({ leads }: LeadsProps) {
  const stats = [
    {
      title: "Total Leads",
      value: leads.length,
      icon: UserGroupIcon,
    },
    {
      title: "Emails Sent",
      value: leads.flatMap((lead) => lead.emails).filter((email) => email.status === "sent").length,
      icon: Mail01Icon,
    },
    {
      title: "Pending Drafts",
      value: leads.flatMap((lead) => lead.emails).filter((email) => email.status === "draft").length,
      icon: File02Icon,
    },
    {
      title: "Failed",
      value: leads.flatMap((lead) => lead.emails).filter((email) => email.status === "failed").length,
      icon: Invoice01Icon,
    },
  ];

  return (
    <div className="border rounded-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y divide-x-0 lg:divide-x sm:divide-y-0 divide-border">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <HugeiconsIcon icon={stat.icon} className="size-4 sm:size-[18px]" />
              <span className="text-xs sm:text-sm font-medium">{stat.title}</span>
            </div>
            <p className="text-2xl sm:text-[28px] font-semibold tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
