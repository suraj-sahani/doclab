import { useMyPresence, useOthers } from "@liveblocks/react";
import { PointerEvent, ReactNode } from "react";
import UserCursor from "../user-cursor";

export default function LiveCursorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [myPresence, updateMyPresence] = useMyPresence();
  const othersPresence = useOthers();

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const cursor = { x: Math.floor(e.pageX), y: e.pageY };
    updateMyPresence({ cursor });
  };

  const handlePointerLeave = () => {
    updateMyPresence({ cursor: null });
  };

  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {children}

      {/* Render Cursors */}
      {othersPresence
        .filter(Boolean)
        .map(({ connectionId, info, presence }) => (
          <UserCursor
            key={connectionId}
            userInfo={info}
            cursorPosition={presence.cursor}
          />
        ))}
    </div>
  );
}
