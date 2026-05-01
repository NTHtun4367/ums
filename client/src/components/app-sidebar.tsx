import * as React from "react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { SIDEBAR_CONFIG } from "@/config/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
            >
              {/* Logo Icon */}
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <SIDEBAR_CONFIG.header.logo className="size-4" />
              </div>

              {/* Text Content */}
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">
                  {SIDEBAR_CONFIG.header.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {SIDEBAR_CONFIG.header.plan}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SIDEBAR_CONFIG.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={SIDEBAR_CONFIG.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
