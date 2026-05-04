"use client";

import { type ReactNode } from "react";
import { LiveblocksProvider } from "@liveblocks/react/suspense";

export default function LiveBlocksHOC({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_API_KEY}
      // authEndpoint={"/auth-endpoint"}

      throttle={16}
    >
      {children}
    </LiveblocksProvider>
  );
}
