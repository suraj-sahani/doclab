import SearchCommand from "@/components/search-command";
import SettingsModal from "@/components/settings";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { type ReactNode } from "react";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SearchCommand />
        <SettingsModal />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
