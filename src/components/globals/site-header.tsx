"use client";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getGreeting } from "@/lib/utils";
import { NavUser } from "./nav-user";
import { ModeToggle } from "./mode-toggle";
import { User } from "@prisma/client";

export function SiteHeader({ user }: { user: User }) {
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    // Update greeting every minute in case the time changes
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-7"
        />
        <h1 className="text-base font-medium">
          {greeting}, {`${user?.username}` || "Admin"}!
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <NavUser
            user={{
              id: user.id,
              name: user.name,
              email: user.username,
              avatar: user.image || "",
            }}
          />
        </div>
      </div>
    </header>
  );
}
