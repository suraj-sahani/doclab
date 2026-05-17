"use client";

import Toolbar from "@/components/toolbar";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import DocumentCover from "./_components/document-cover";

export default function DocumentDetailsPage() {
  const { documentId } = useParams();

  const document = useQuery(
    api.documents.getDocumentById,
    documentId
      ? {
          docId: Array.isArray(documentId)
            ? (documentId[0]! as Id<"documents">)
            : (documentId as Id<"documents">),
        }
      : "skip",
  );

  if (document === undefined) return "Loading...";
  if (document === null) return "Not Found";
  console.dir({ document });

  return (
    <section className="container p-4 mx-auto">
      <DocumentCover docId={document._id} storageId={document.coverImage} />
      <Toolbar doc={document} />
      {documentId}
    </section>
  );
}
