"use client";

import { useRoom } from "@liveblocks/react";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import BlockNote from "./blocknote";

type Props = {
  content?: unknown;
};
export default function Editor() {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  console.log(room);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yPorivder = new LiveblocksYjsProvider(room, yDoc);

    setDoc(yDoc);
    setProvider(yPorivder);

    return () => {
      yDoc?.destroy();
      yPorivder?.destroy();
    };
  }, [room]);

  if (!doc || !provider) return null;

  return (
    <div className="max-w-7xl mx-auto h-full">
      <BlockNote doc={doc} provider={provider} />
    </div>
  );
}
