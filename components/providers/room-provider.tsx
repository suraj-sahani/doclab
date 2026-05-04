import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import { type ReactNode } from "react";
import { Spinner } from "../ui/spinner";
import LiveCursorProvider from "./live-cursor-provider";

export default function RoomProviderHOC({
  children,
  roomId,
}: {
  children: ReactNode;
  roomId: string;
}) {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense fallback={<Spinner />}>
        <LiveCursorProvider>{children}</LiveCursorProvider>
      </ClientSideSuspense>
    </RoomProvider>
  );
}
