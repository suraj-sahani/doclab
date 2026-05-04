import * as Y from "yjs";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { useSelf } from "@liveblocks/react/suspense";
import { useCreateBlockNote } from "@blocknote/react";
import { generateRandomColor } from "@/lib/utils";
type Props = {
  doc: Y.Doc;
  provider: any;
};
export default function BlockNote({ provider, doc }: Props) {
  const userInfo = useSelf((me) => me.info);
  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo?.name,
        color: generateRandomColor(userInfo?.email || "1"),
      },
    },
  });

  return (
    <section className="relative">
      <BlockNoteView editor={editor} className="flex-1" theme="light" />
    </section>
  );
}
