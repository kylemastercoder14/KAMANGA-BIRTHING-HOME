"use client";

import * as React from "react";
import {
  IconCalendarWeekFilled,
  IconClipboardDataFilled,
  IconDashboardFilled,
  IconDeviceHeartMonitorFilled,
  IconFileTextFilled,
  IconStack3Filled,
  IconUserFilled,
  IconSettingsFilled,
  IconClipboardTextFilled,
  IconLibraryPhoto,
} from "@tabler/icons-react";

import { NavMain } from "@/components/globals/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboardFilled,
    },
    {
      title: "Barangay Profiling",
      url: "#",
      icon: IconClipboardDataFilled,
      items: [
        {
          title: "Create new profile",
          url: "/barangay-profiling/create-profile",
        },
        {
          title: "Manage profiles",
          url: "/barangay-profiling",
        },
        {
          title: "Inactive profiles",
          url: "/barangay-profiling/inactive-profiles",
        },
      ],
    },
    {
      title: "Upcoming Events",
      url: "/upcoming-events",
      icon: IconCalendarWeekFilled,
    },
    {
      title: "Health Programs",
      url: "/health-programs",
      icon: IconDeviceHeartMonitorFilled,
    },
    {
      title: "File Manager",
      url: "/file-manager",
      icon: IconLibraryPhoto,
    },
    {
      title: "Manage Employees",
      url: "/manage-employees",
      icon: IconUserFilled,
    },
    {
      title: "Activity Notes",
      url: "/activity-notes",
      icon: IconClipboardTextFilled,
    },
    {
      title: "Backup Database",
      url: "/backup-database",
      icon: IconStack3Filled,
    },
    {
      title: "System Logs",
      url: "/system-logs",
      icon: IconFileTextFilled,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettingsFilled,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 text-white hover:text-white mt-2 hover:bg-transparent"
            >
              <a href="/dashboard">
                <Image src="/kamanga.jpg" alt="Logo" width={40} height={40} />
                <div>
                  <p className="text-sm font-semibold">
                    Health Center Profiling
                  </p>
                  <p className="text-xs">Admin Panel</p>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
