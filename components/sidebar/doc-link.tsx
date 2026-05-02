"use client";

import { db } from "@/lib/firebase/client";
import { DocRef } from "@/lib/types";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { SidebarMenuSubButton, SidebarMenuSubItem } from "../ui/sidebar";

type Props = {
  docRef: DocRef;
};
export default function DocLink({ docRef }: Props) {
  const { roomId } = docRef;
  const [docData] = useDocumentData(doc(db, "documents", roomId));

  if (!docData) return null;

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton size="sm" render={<Link href={`/doc/${roomId}`} />}>
        <span>{docData?.title}</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
