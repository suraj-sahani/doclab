"use client";

import CreateDocumentButton from "@/app/(main)/_components/create-document-button";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { PlusSignSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "convex/react";
import { Skeleton } from "../ui/skeleton";
import DocumentListItem from "./document-list-item";

export default function DocumentList() {
  const docs = useQuery(api.documents.getUserDocuments);

  if (docs === undefined)
    return (
      <SidebarContent className="space-y-2 px-2 mt-4">
        {Array.from({ length: 5 }, (_, index) => index).map((i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </SidebarContent>
    );

  console.dir({ docs }, { depth: null });
  return (
    <SidebarGroup>
      <SidebarGroupLabel>My Documents</SidebarGroupLabel>
      <SidebarMenu>
        {docs.map((item) => {
          return <DocumentListItem doc={item} key={item._id} level={0} />;
        })}

        <CreateDocumentButton
          variant={"ghost"}
          size={"sm"}
          className={"justify-start text-xs"}
        >
          <HugeiconsIcon
            icon={PlusSignSquareIcon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
          />
          New Page
        </CreateDocumentButton>
      </SidebarMenu>
    </SidebarGroup>
  );
}
