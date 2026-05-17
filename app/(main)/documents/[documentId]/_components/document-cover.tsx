"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConverImageStore } from "@/lib/store";
import { useQuery } from "convex/react";
import Image from "next/image";

type Props = {
  docId: Id<"documents">;
  storageId?: Id<"_storage">;
};
export default function DocumentCover({ docId, storageId }: Props) {
  const openCoverImage = useConverImageStore((store) => store.onOpen);

  const imageUrl = useQuery(
    api.documents.getFileUrl,
    storageId ? { storageId } : "skip",
  );

  if (!storageId) return null;
  if (imageUrl === undefined) return <Skeleton className="w-full h-125" />;

  return (
    <div className="relative group/cover">
      <Image
        src={imageUrl.url ?? ""}
        height={150}
        width={1080}
        alt="doc-cover"
        className="w-full h-100 object-cover"
      />

      <div className="opacity-0 flex items-center gap-2 absolute bottom-5 right-5 group-hover/cover:opacity-100 transition-opacity duration-200">
        <Button variant={"outline"} onClick={openCoverImage}>
          Change Cover
        </Button>
        <Button variant={"destructive"}>Remove Cover</Button>
      </div>
    </div>
  );
}
