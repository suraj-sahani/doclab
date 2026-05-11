"use client";

import * as React from "react";

import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Logo } from "../logo";
import { Skeleton } from "../ui/skeleton";
import DocumentList from "./document-list";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser();

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
        <DocumentList />
      </SidebarContent>
      <SidebarFooter>
        {user.isLoaded ? (
          <NavUser
            user={{
              name: user?.user?.fullName || "",
              email: user?.user?.emailAddresses?.[0]?.emailAddress || "",
              avatar: user?.user?.imageUrl || "",
            }}
          />
        ) : (
          <Skeleton className="h-15 w-full" />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
