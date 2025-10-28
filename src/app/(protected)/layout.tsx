import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/globals/app-sidebar";
import { SiteHeader } from "@/components/globals/site-header";
import { ThemeProvider } from "@/components/globals/theme-provider";
import { useUser } from "@/hooks/use-user";
import { redirect } from "next/navigation";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  if (!user) redirect("/sign-in");
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          <SiteHeader user={user} />
          {/* bg-gradient-to-b min-h-screen from-transparent via-green-700/30 to-green-900/50 */}
          <main className="bg-background min-h-screen">
            <div className="p-5">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default ProtectedLayout;
