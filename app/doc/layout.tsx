import LiveBlocksHOC from "@/components/providers/liveblocks-hoc";
import { type ReactNode } from "react";

export default function DocumentDetailsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <LiveBlocksHOC>{children}</LiveBlocksHOC>;
}
