"use client";

import Toolbar from "@/components/toolbar";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import DocumentCover from "./_components/document-cover";
import { useUser } from "@clerk/nextjs";
import Editor from "./_components/editor";
import { useDebounce } from "@/hooks/use-debounce";

export default function DocumentDetailsPage() {
  const { documentId } = useParams();
  const { user } = useUser();
  const document = useQuery(
    api.documents.getDocumentById,
    documentId && user
      ? {
          docId: Array.isArray(documentId)
            ? (documentId[0]! as Id<"documents">)
            : (documentId as Id<"documents">),
        }
      : "skip",
  );
  const updateDoc = useMutation(api.documents.updateDoc);

  const onChange = useDebounce((value: string) => {
    updateDoc({
      id: documentId as Id<"documents">,
      content: value,
    });
  }, 1500);

  if (document === undefined)
    return (
      <div className="container mx-auto flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (document === null)
    return (
      <section className="container mx-auto flex-1 flex items-center justify-center">
        <p className="text-2xl font-medium text-center">Document not found</p>
      </section>
    );

  console.dir({ document });

  return (
    <section className="container p-4 mx-auto">
      <DocumentCover docId={document._id} storageId={document.coverImage} />
      <Toolbar doc={document} />
      <Editor content={document.content} onChange={onChange} />
    </section>
  );
}
