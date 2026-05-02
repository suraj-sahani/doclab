"use client";
import { useTransition, type ReactNode } from "react";
import { Button } from "./ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { createDocument } from "@/lib/action";
import { Spinner } from "./ui/spinner";

type Props = {
  children?: ReactNode;
};
export default function CreateDocumentButton({}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreateNewDocument = () => {
    startTransition(async () => {
      const res = await createDocument();
      if (res.success) {
        const {
          data: { docId },
        } = res;
        router.push(`/doc/${docId}`);
      } else {
        console.error(res.error);
      }
    });
  };

  return (
    <Button disabled={isPending} onClick={handleCreateNewDocument}>
      {isPending ? (
        <Spinner />
      ) : (
        <>
          <HugeiconsIcon
            icon={Add01Icon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
          />
          Add New
        </>
      )}
    </Button>
  );
}
