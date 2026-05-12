import * as React from "react";
import { useSelector } from "react-redux";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { SIDEBAR_CONFIG } from "@/config/sidebar";
// FIXED: Use type-only import for RootState
import type { RootState } from "@/store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  // Filter main navigation based on the user role from backend
  const filteredNavMain = SIDEBAR_CONFIG.navMain.filter((item) =>
    userInfo?.role ? item.roles.includes(userInfo.role) : false,
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <SIDEBAR_CONFIG.header.logo className="size-4" />
              </div>
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
        {/* userInfo.role is now correctly recognized */}
        <NavMain items={filteredNavMain} userRole={userInfo?.role} />
      </SidebarContent>

      <SidebarFooter>
        {/* userInfo now matches the User type expected by NavUser */}
        {userInfo && <NavUser user={userInfo} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
