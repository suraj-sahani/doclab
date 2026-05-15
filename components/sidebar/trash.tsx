"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Delete02Icon,
  Search01Icon,
  UndoIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { SidebarGroup } from "../ui/sidebar";
import DocumentSkeleton from "./document-skeleton";

export default function Trash() {
  const router = useRouter();
  const params = useParams();
  const archivedDocs = useQuery(api.documents.getArchivedDocs);
  const deleteDoc = useMutation(api.documents.deleteDoc);
  const restoreDoc = useMutation(api.documents.restoreArchivedDoc);

  const [search, setSearch] = useState("");
  const filteredDocs =
    archivedDocs?.filter((doc) =>
      doc.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
    ) ?? [];

  const handleClick = (docId: string) => {
    router.push(`/documents/${docId}`);
  };

  const handleRestore = (documentId: Id<"documents">) => {
    const promise = restoreDoc({ docId: documentId });

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note",
    });
  };

  const handleDelete = (documentId: Id<"documents">) => {
    const promise = deleteDoc({ docId: documentId });

    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note",
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  console.log(archivedDocs);
  return (
    <SidebarGroup>
      <Popover>
        <PopoverTrigger
          render={
            <Button variant="ghost" size={"xs"} className={"justify-start"}>
              Trash{" "}
              <HugeiconsIcon
                icon={Delete02Icon}
                size={24}
                color="currentColor"
                strokeWidth={1.5}
              />
            </Button>
          }
        />

        <PopoverContent>
          <PopoverTitle>Trash</PopoverTitle>
          <InputGroup className="max-w-xs">
            <InputGroupInput
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
              <HugeiconsIcon
                icon={Search01Icon}
                size={24}
                color="currentColor"
                strokeWidth={1.5}
              />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              {filteredDocs.length} results
            </InputGroupAddon>
          </InputGroup>
          <div className="mt-1 space-y-1">
            {archivedDocs === undefined ? (
              <div className="space-y-2">
                <DocumentSkeleton />
              </div>
            ) : (
              filteredDocs?.map((document) => (
                <Button
                  size={"xs"}
                  className={"w-full justify-between"}
                  variant={"ghost"}
                  key={document._id}
                  onClick={() => handleClick(document._id)}
                >
                  <span className="truncate pl-2">{document.title}</span>
                  <div className="flex items-center gap-0.5">
                    <Button
                      size={"xs"}
                      render={<div role="button" />}
                      nativeButton={false}
                      variant={"ghost"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(document._id);
                      }}
                    >
                      <HugeiconsIcon
                        icon={UndoIcon}
                        size={24}
                        color="currentColor"
                        strokeWidth={1.5}
                      />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger
                        onClick={(e) => e.stopPropagation()}
                        nativeButton={false}
                        render={
                          <Button
                            variant="ghost"
                            size={"icon-xs"}
                            render={<div role="button" />}
                            nativeButton={false}
                          >
                            <HugeiconsIcon
                              icon={Delete02Icon}
                              size={24}
                              color="currentColor"
                              strokeWidth={1.5}
                            />
                          </Button>
                        }
                      />

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={(e) => e.stopPropagation()}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(document._id);
                            }}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </SidebarGroup>
  );
}
