"use client";
import CreateDocumentButton from "@/app/(main)/_components/create-document-button";
import { AccumulatedDoc } from "@/lib/types"; // Ensure this matches your recursive type
import {
  ArrowRight01Icon,
  Delete03Icon,
  File01Icon,
  MoreHorizontalIcon,
  PlusSignSquareIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { BaseUIEvent } from "@base-ui/react";
import { MouseEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  doc: AccumulatedDoc;
  level?: number;
};

export default function DocumentListItem({ doc, level = 0 }: Props) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const hasChildren = doc?.childDocs && doc?.childDocs?.length > 0;
  const archiveDoc = useMutation(api.documents.archiveDoc);

  const handleArchive = (
    event: BaseUIEvent<MouseEvent<HTMLDivElement, globalThis.MouseEvent>>,
  ) => {
    event.stopPropagation();
    const archivePromise = archiveDoc({ id: doc._id });

    toast.promise(archivePromise, {
      success: "Document archived successfully.",
      loading: "Moving to trash...",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to archive document",
    });
  };
  return (
    <Collapsible
      key={doc._id}
      className="group/collapsible w-full"
      render={<SidebarMenuItem />}
      open={open}
      onOpenChange={setOpen}
    >
      <div
        className="flex items-center gap-1 group"
        style={{ paddingLeft: `${level * 2}px` }} // Manual indentation control
      >
        <CollapsibleTrigger
          nativeButton={false}
          onClick={(e) => {
            e.stopPropagation();
            // router.push(`/documents/${doc._id}`);
          }}
          render={
            <SidebarMenuButton
              size={"xs"}
              tooltip={doc.title}
              className="flex-1 overflow-hidden"
              render={<div />}
            >
              <Button
                variant={"ghost"}
                size={"icon-xs"}
                className="hover:bg-accent/10"
              >
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90",
                    !hasChildren && "opacity-0", // Hide chevron if no children but keep space
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                  }}
                />
              </Button>

              {/* Document Icon or Default File Icon */}
              <span className="shrink-0">
                {doc.icon ? (
                  doc.icon
                ) : (
                  <HugeiconsIcon icon={File01Icon} size={16} strokeWidth={2} />
                )}
              </span>

              {/* Title: Truncate to prevent breaking the layout */}
              <span className="truncate font-medium">{doc.title}</span>

              {/* Add Page Button: Visible on row hover */}
              <div className="ml-auto flex items-center gap-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        size={"icon-xs"}
                        variant="ghost"
                        className={"hover:bg-accent/10"}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <HugeiconsIcon
                          icon={MoreHorizontalIcon}
                          size={24}
                          color="currentColor"
                          strokeWidth={1.5}
                        />
                      </Button>
                    }
                  />
                  <DropdownMenuContent className={"w-fit"}>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        className={"text-xs"}
                        onClick={handleArchive}
                      >
                        <HugeiconsIcon
                          icon={Delete03Icon}
                          size={24}
                          color="currentColor"
                          strokeWidth={1.5}
                        />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className={"text-xs"} disabled>
                        Last edited by: {user?.fullName}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <CreateDocumentButton
                  variant={"ghost"}
                  size={"icon-sm"}
                  className={"h-6 w-6 hover:bg-accent/10"}
                  parentDocumentId={doc._id}
                >
                  <HugeiconsIcon
                    icon={PlusSignSquareIcon}
                    size={16}
                    strokeWidth={2}
                  />
                </CreateDocumentButton>
              </div>
            </SidebarMenuButton>
          }
        />
      </div>

      <CollapsibleContent>
        {/* Use SidebarMenuSub for the vertical line styling if desired,
            but we manage horizontal spacing with the level prop */}
        <SidebarMenuSub className="mr-0 pr-0 border-l ml-3.5">
          {hasChildren ? (
            doc.childDocs!.map((subItem) => (
              <DocumentListItem
                doc={subItem}
                key={subItem._id}
                level={level + 1}
              />
            ))
          ) : (
            <div
              className="py-1 text-[11px] text-muted-foreground"
              style={{ paddingLeft: `${(level + 1) * 2 + 4}px` }}
            >
              No pages inside
            </div>
          )}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}
