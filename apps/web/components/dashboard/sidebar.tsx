"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  ChartLineData01Icon,
  Notification01Icon,
  Calendar01Icon,
  Task01Icon,
  UserGroupIcon,
  HelpCircleIcon,
  Settings01Icon,
  ArrowRight01Icon,
  ArrowDown01Icon,
  Invoice01Icon,
  Logout01Icon,
  UserIcon,
  Coins01Icon,
  Globe02Icon,
} from "@hugeicons/core-free-icons";

const menuItems = [
  {
    title: "Dashboard",
    icon: DashboardSquare01Icon,
    href: "/dashboard",
    matchPath: (pathname: string) => pathname === "/dashboard",
  },
  {
    title: "Leads",
    icon: ChartLineData01Icon,
    href: "/dashboard/leads",
    matchPath: (pathname: string) => pathname.startsWith("/dashboard/leads"),
  },
  {
    title: "Emails",
    icon: Notification01Icon,
    href: "#",
  },
  {
    title: "Contacts",
    icon: UserGroupIcon,
    href: "#",
  },
];

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offExamples" className="lg:border-r-0!" {...props}>
      <SidebarHeader className="p-3 sm:p-4 lg:p-5 pb-0">
        <div className="flex items-center gap-2 pb-2">
          <div className="flex size-10 items-center justify-center rounded bg-linear-to-b from-[#cc6600] to-[#000000] text-white">
            <Image
              src="/brand/wakaima-logo-white.png"
              width={50}
              height={50}
              alt="wakaima logo" />
          </div>
          <span className="font-semibold text-base sm:text-lg">Wakaima</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 sm:px-4 lg:px-5">

        <SidebarGroup className="p-0">

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = item.matchPath ? item.matchPath(pathname) : false;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      className="h-9 sm:h-[38px]"
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        className={`size-4 sm:size-5 ${
                          item.isGradient ? "text-[#cc6600]" : ""
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          item.isGradient
                            ? "bg-clip-text text-transparent bg-linear-to-r from-[#cc6600] to-[#e67300]"
                            : ""
                        }`}
                      >
                        {item.title}
                      </span>
                      {isActive && (
                        <HugeiconsIcon icon={ArrowRight01Icon} className="ml-auto size-4 text-muted-foreground opacity-60" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4 lg:pb-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="#" />} className="h-9 sm:h-[38px]">
              <HugeiconsIcon icon={HelpCircleIcon} className="size-4 sm:size-5" />
              <span className="text-sm">Help Center</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/dashboard/settings" />} className="h-9 sm:h-[38px]">
              <HugeiconsIcon icon={Settings01Icon} className="size-4 sm:size-5" />
              <span className="text-sm">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <Avatar className="size-7 sm:size-8">
                  <AvatarImage src="https://api.dicebear.com/9.x/glass/svg?seed=LN" />
                  <AvatarFallback className="text-xs">JC</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs sm:text-sm">LN</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    leonelngoya@gmail.com
                  </p>
                </div>
                <HugeiconsIcon icon={ArrowDown01Icon} className="size-4 text-muted-foreground shrink-0" />
              </div>
            }
          />
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem>
              <HugeiconsIcon icon={UserIcon} className="size-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon icon={Coins01Icon} className="size-4 mr-2" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon icon={Settings01Icon} className="size-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <HugeiconsIcon icon={Logout01Icon} className="size-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
