"use client";
import CreateDocumentButton from "@/app/(main)/_components/create-document-button";
import { AccumulatedDoc } from "@/lib/types"; // Ensure this matches your recursive type
import {
  ArrowRight01Icon,
  File01Icon,
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

type Props = {
  doc: AccumulatedDoc;
  level?: number;
};

export default function DocumentListItem({ doc, level = 0 }: Props) {
  const hasChildren = doc?.childDocs && doc?.childDocs?.length > 0;

  return (
    <Collapsible
      key={doc._id}
      className="group/collapsible w-full"
      render={<SidebarMenuItem />}
    >
      <div
        className="flex items-center gap-1 group"
        style={{ paddingLeft: `${level * 2}px` }} // Manual indentation control
      >
        <CollapsibleTrigger
          render={
            <SidebarMenuButton
              size={"xs"}
              tooltip={doc.title}
              className="flex-1 overflow-hidden"
            >
              {/* Chevron: only show if has children, or always show but hide icon if empty */}
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90",
                  !hasChildren && "opacity-0", // Hide chevron if no children but keep space
                )}
              />

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
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <CreateDocumentButton
                  variant={"ghost"}
                  size={"icon-sm"}
                  className={"h-6 w-6 hover:bg-accent"}
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
