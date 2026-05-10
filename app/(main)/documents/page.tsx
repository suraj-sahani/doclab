import { currentUser } from "@clerk/nextjs/server";
import { PlusSignSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import CreateDocumentButton from "../_components/create-document-button";

export default async function DocumentPage() {
  const user = await currentUser();

  return (
    <div className="flex flex-col justify-center items-center h-full space-y-4">
      <Image
        className="dark:hidden"
        src="/empty.png"
        alt="Empty"
        width="300"
        height="300"
      />
      <Image
        className="hidden dark:block"
        src="/empty-dark.png"
        alt="Empty"
        width="300"
        height="300"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Doclab
      </h2>
      <CreateDocumentButton>
        <HugeiconsIcon
          icon={PlusSignSquareIcon}
          size={24}
          color="currentColor"
          strokeWidth={1.5}
        />
        Create note
      </CreateDocumentButton>
    </div>
  );
}
