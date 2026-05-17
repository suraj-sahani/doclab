"use client";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useTheme } from "next-themes";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type Props = {
  content: string | undefined;
  onChange: (val: string) => void;
  editable?: boolean;
};
export default function Editor({ content, onChange, editable }: Props) {
  const { resolvedTheme } = useTheme();

  const editor = useCreateBlockNote({
    initialContent: content ? JSON.parse(content) : undefined,
  });

  return (
    <section>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={(editor) => {
          onChange(JSON.stringify(editor.document, null, 2));
        }}
        editable={editable}
        className="bg-transparent!"
      />
    </section>
  );
}
