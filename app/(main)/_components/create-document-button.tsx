"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { toast } from "sonner";

type CreateDocumentButtonProps = React.ComponentProps<typeof Button> & {
  parentDocumentId?: Id<"documents">;
};

export default function CreateDocumentButton({
  children,
  parentDocumentId,
  ...props
}: CreateDocumentButtonProps) {
  const createDocumentMutation = useMutation(api.documents.createDocument);

  const onCreate = async () => {
    const createPromise = createDocumentMutation({
      title: "Untitled",
      parentDocument: parentDocumentId,
    });

    toast.promise(createPromise, {
      loading: "Creating a new note...",
      success: "Note created successfully.",
      error: (err) =>
        err instanceof Error ? err.message : "Failed to create note!",
    });
  };

  return (
    <Button
      {...props}
      onClick={(e) => {
        e?.stopPropagation();
        onCreate();
      }}
    >
      {children}
    </Button>
  );
}
