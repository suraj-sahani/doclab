"use client";

import CreateDocumentButton from "@/app/(main)/_components/create-document-button";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { PlusSignSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "convex/react";
import DocumentListItem from "./document-list-item";
import DocumentSkeleton from "./document-skeleton";

export default function DocumentList() {
  const docs = useQuery(api.documents.getUserDocuments);

  if (docs === undefined)
    return (
      <SidebarGroup className="space-y-2">
        <DocumentSkeleton />
      </SidebarGroup>
    );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>My Documents</SidebarGroupLabel>
      <SidebarMenu>
        {docs?.map((item) => {
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
