import RoomProviderHOC from "@/components/providers/room-provider";
import { type ReactNode } from "react";

export default async function DocumentDetailsRoomLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ docId: string }>;
}) {
  const { docId } = await params;
  return <RoomProviderHOC roomId={docId}>{children}</RoomProviderHOC>;
}
