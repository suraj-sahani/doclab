"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { IconPicker } from "./icon-picker";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Textarea } from "./ui/textarea";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Image01Icon } from "@hugeicons/core-free-icons";
import { useConverImageStore } from "@/lib/store";

type Props = {
  doc: Doc<"documents">;
  preview?: boolean;
};

export default function Toolbar({ doc, preview = false }: Props) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(doc.title);

  const updateDoc = useMutation(api.documents.updateDoc);

  const openCoverImage = useConverImageStore((store) => store.onOpen);

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(doc.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = (value: string) => {
    setValue(value);
    updateDoc({
      id: doc._id,
      title: value,
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = (icon: string) => {
    updateDoc({
      id: doc._id,
      icon,
    });
  };

  const onRemoveIcon = () => {
    updateDoc({
      id: doc._id,
      icon: undefined,
    });
  };

  return (
    <div>
      {!!doc.icon && !preview && (
        <div className="flex gap-x-2 items-center group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">{doc.icon}</p>
          </IconPicker>
          <Button
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition
            text-muted-foreground text-xs"
            variant="outline"
            size="icon"
            onClick={onRemoveIcon}
          >
            {" "}
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={24}
              color="currentColor"
              strokeWidth={1.5}
            />
          </Button>
        </div>
      )}
      {!!doc.icon && preview && <p className="text-6xl pt-6">{doc.icon}</p>}
      <div className=" flex items-center gap-x-1 py-4">
        {!doc.icon && !preview && (
          <IconPicker
            render={
              <Button
                className="text-muted-foreground text-xs"
                variant="outline"
                size="sm"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={24}
                  color="currentColor"
                  strokeWidth={1.5}
                />
                Add icon
              </Button>
            }
            onChange={onIconSelect}
          ></IconPicker>
        )}
        {!doc.coverImage && !preview && (
          <Button
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
            onClick={openCoverImage}
          >
            <HugeiconsIcon
              icon={Image01Icon}
              size={24}
              color="currentColor"
              strokeWidth={1.5}
            />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <Textarea
          className="text-5xl bg-transparent font-bold wrap-break-word outline-none text-[#3F3F3F] dark:text-[#CFCFCF]
          resize-none"
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
        />
      ) : (
        <div
          className="pb-[11.5px] text-5xl font-bold wrap-break-word outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
          onClick={enableInput}
        >
          {doc.title}
        </div>
      )}
    </div>
  );
}
