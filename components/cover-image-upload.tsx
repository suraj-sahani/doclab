"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConverImageStore } from "@/lib/store";
import { FileDropzone } from "./ui/file-dropzone";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export function CoverImageModal() {
  const { documentId } = useParams();
  const updateDoc = useMutation(api.documents.updateDoc);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverImage = useConverImageStore();

  const onClose = () => {
    setFile(null);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onUpload = async () => {
    if (!file) return;
    if (!documentId) return;
    try {
      setIsSubmitting(true);
      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file!.type },
        body: file,
      });

      const { storageId } = await result.json();

      const promise = updateDoc({
        id: documentId as Id<"documents">,
        coverImage: storageId,
      });

      toast.promise(promise, {
        loading: "Uploading cover image...",
        success: "Cover image uploaded successfully",
        error: (err) =>
          err instanceof Error ? err.message : "Failed to upload cover image",
      });
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent className={"min-w-lg max-w-fit!"}>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <FileDropzone.Root
          acceptedFileTypes={["image/*"]}
          maxFileSize={5 * 1024 * 1024}
          maxFiles={1}
          showPreview
          onFilesSelected={(files) => setFile(files[0])}
          onFileRemove={() => setFile(null)}
          disabled={isSubmitting}
        >
          <FileDropzone.Trigger>
            <svg
              className="mb-2 h-8 w-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-center font-medium">Drag images here or click</p>
            <p className="text-center text-sm text-muted-foreground">
              PNG, JPG, GIF up to 5MB
            </p>
          </FileDropzone.Trigger>

          <FileDropzone.Input />
          <FileDropzone.ErrorList />
          <FileDropzone.FileList />
        </FileDropzone.Root>
        <Button onClick={onUpload} disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : "Upload"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
