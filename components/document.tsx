"use client";

import { db } from "@/lib/firebase/client";
import { doc, updateDoc } from "firebase/firestore";
import { useTransition } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Field } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import Editor from "./editor";

type Props = {
  documentId: string;
};
export default function DocumentDetails({ documentId }: Props) {
  const [docContenta, loading, error] = useDocumentData(
    doc(db, "documents", documentId),
  );
  const [isPending, startTransition] = useTransition();

  const handleTItleChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget; // better than e.target for typing
    const formData = new FormData(form);

    const data = Object.fromEntries(formData.entries()) as {
      title: string;
    };

    if (!data.title.trim()) return;

    startTransition(async () => {
      await updateDoc(doc(db, "documents", documentId), {
        title: data.title,
      });
    });
  };

  return (
    <section className="max-w-7xl mx-auto h-full">
      <form className="flex space-x-2" onSubmit={handleTItleChange}>
        <Field orientation="horizontal">
          <Input
            key={docContenta?.title || ""}
            type="text"
            name="title"
            placeholder="Title..."
            defaultValue={docContenta?.title || ""}
          />
          <Button type="submit">
            {isPending ? <Spinner /> : "Update Title"}
          </Button>
        </Field>
      </form>

      <Editor />
    </section>
  );
}
