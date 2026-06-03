"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  roles?: string[];
  items?: {
    title: string;
    url: string;
    roles?: string[];
  }[];
}

export function NavMain({
  items,
  userRole,
}: {
  items: NavItem[];
  userRole?: string;
}) {
  const location = useLocation();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // Initialize open items based on current location
  useEffect(() => {
    const newOpenItems = new Set<string>();
    items.forEach((item) => {
      if (item.items) {
        const hasActiveChild = item.items.some(
          (subItem) => location.pathname === subItem.url
        );
        if (hasActiveChild) {
          newOpenItems.add(item.title);
        }
      }
    });
    setOpenItems(newOpenItems);
  }, [location.pathname, items]);

  const toggleOpen = (title: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Filter sub-items based on user role
          const filteredSubItems = item.items?.filter(
            (sub) => !sub.roles || (userRole && sub.roles.includes(userRole)),
          );

          if (filteredSubItems && filteredSubItems.length > 0) {
            return (
              <Collapsible
                key={item.title}
                asChild
                className="group/collapsible"
                open={openItems.has(item.title)}
                onOpenChange={() => toggleOpen(item.title)}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip={item.title} 
                      isActive={item.url === location.pathname}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {filteredSubItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton 
                            asChild 
                            isActive={subItem.url === location.pathname}
                          >
                            <Link to={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                tooltip={item.title} 
                isActive={item.url === location.pathname}
              >
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
