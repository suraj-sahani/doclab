"use client";

import * as React from "react";

import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
