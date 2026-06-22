"use client";

import { leadStats } from "@/mock-data/leads";
import { HugeiconsIcon } from "@hugeicons/react";
import { Invoice01Icon, UserGroupIcon, Task01Icon, Notification01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { LeadsProps } from "@/lib/types";


export function StatsCards({ leads }: LeadsProps) {
  const stats = [
    {
      title: "Total Leads",
      value: leads.length,
      change: leadStats.totalLeadsChange,
      changeValue: leadStats.totalLeadsChangeValue,
      icon: Invoice01Icon,
    },
    {
      title: "Contacted Leads",
      value: leads.flatMap((lead) => lead.emails).filter((email) => email.status === "sent").length,
      change: leadStats.contactedLeadsChange,
      changeValue: leadStats.contactedLeadsChangeValue,
      icon: UserGroupIcon,
    },
    {
      title: "Delivered Emails",
      value: leads.flatMap((lead) => lead.emails).filter((email) => email.status === "sent").length,
      change: leadStats.qualifiedLeadsChange,
      changeValue: leadStats.qualifiedLeadsChangeValue,
      icon: Mail01Icon,
    },
    {
      title: "Pending Drafts",
      value: leads.flatMap((lead) => lead.emails).filter((email) => email.status === "draft").length,
      change: leadStats.hotLeadsChange,
      changeValue: leadStats.hotLeadsChangeValue,
      icon: Notification01Icon,
    },
  ];

  return (
    <div className="border rounded-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y divide-x-0 lg:divide-x sm:divide-y-0 divide-border">
        {stats.map((stat, index) => (
          <div key={index} className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <HugeiconsIcon icon={stat.icon} className="size-4 sm:size-[18px]" />
              <span className="text-xs sm:text-sm font-medium">
                {stat.title}
              </span>
            </div>
            <p className="text-2xl sm:text-[28px] font-semibold tracking-tight">
              {stat.value}
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                +{stat.change}%(
                {stat.changeValue > 0
                  ? `$${stat.changeValue}`
                  : stat.changeValue}
                )
              </span>
              <span className="size-1 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground hidden sm:inline">
                vs Last Months
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
