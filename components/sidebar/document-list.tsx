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
          size={"icon-sm"}
          className={"h-6 gap-2 w-full justify-start p-2"}
        >
          <HugeiconsIcon icon={PlusSignSquareIcon} size={16} strokeWidth={2} />
          New Document
        </CreateDocumentButton>
      </SidebarMenu>
    </SidebarGroup>
  );
}
