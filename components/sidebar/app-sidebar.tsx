"use client";

import * as React from "react";

import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Authenticated, AuthLoading } from "convex/react";
import Link from "next/link";
import { Logo } from "../logo";
import DocumentList from "./document-list";
import DocumentSkeleton from "./document-skeleton";
import Trash from "./trash";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { Kbd } from "../ui/kbd";
import { useSearchStore, useSettingsStore } from "@/lib/store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const toggle = useSearchStore((store) => store.toggle);
  const openSettings = useSettingsStore((store) => store.onOpen);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton render={<Link href={"/"} />}>
            <Logo />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <Authenticated>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="justify-between" onClick={toggle}>
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={24}
                      color="currentColor"
                      strokeWidth={1.5}
                    />
                    Search
                  </div>
                  <Kbd>⌘ K</Kbd>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={openSettings}>
                  {" "}
                  <HugeiconsIcon
                    icon={Settings01Icon}
                    size={24}
                    color="currentColor"
                    strokeWidth={1.5}
                  />
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <DocumentList />
          <Trash />
        </Authenticated>
        <AuthLoading>
          <SidebarGroup className="space-y-2">
            <DocumentSkeleton />
          </SidebarGroup>
        </AuthLoading>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
