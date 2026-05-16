"use client";

import { cn } from "@/lib/utils";
import { Cancel01Icon, File02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

/** File Dropzone Context */
interface FileDropzoneContextType {
  files: File[];
  isDragging: boolean;
  errors: string[];
  disabled: boolean;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  showPreview?: boolean;
  addFiles: (newFiles: File[]) => void;
  removeFile: (index: number) => void;
  setIsDragging: (isDragging: boolean) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFilesSelected?: (files: File[]) => void;
  onFileRemove?: (fileName: string) => void;
}

const FileDropzoneContext = createContext<FileDropzoneContextType | undefined>(
  undefined,
);

/** Hook to access file dropzone context */
function useFileDropzone() {
  const context = useContext(FileDropzoneContext);
  if (!context) {
    throw new Error(
      "File dropzone components must be used within <FileDropzone.Root>",
    );
  }
  return context;
}

/** Props for FileDropzone.Root */
interface FileDropzoneRootProps {
  children: React.ReactNode;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  showPreview?: boolean;
  disabled?: boolean;
  onFilesSelected?: (files: File[]) => void;
  onFileRemove?: (fileName: string) => void;
}

/** Props for FileDropzone.Trigger */
interface FileDropzoneTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/** Props for FileDropzone.FileList */
interface FileDropzoneFileListProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/** Props for FileDropzone.File */
interface FileDropzoneFileProps {
  index: number;
  children?: React.ReactNode;
}

/** Props for FileDropzone.Preview */
interface FileDropzonePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
}

/** Props for FileDropzone.RemoveButton */
interface FileDropzoneRemoveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  index: number;
}

/** Props for FileDropzone.Input */
interface FileDropzoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/** Props for FileDropzone.ErrorList */
interface FileDropzoneErrorListProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * FileDropzone Root Component
 * Manages state and provides context for all dropzone sub-components
 */
function FileDropzoneRoot({
  children,
  acceptedFileTypes = ["*"],
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 1,
  multiple = false,
  showPreview = true,
  disabled = false,
  onFilesSelected,
  onFileRemove,
}: FileDropzoneRootProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      if (file.size > maxFileSize) {
        const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2);
        return `File "${file.name}" exceeds max size of ${maxSizeMB}MB`;
      }

      // Check file type
      if (acceptedFileTypes.length > 0 && !acceptedFileTypes.includes("*")) {
        const isAccepted = acceptedFileTypes.some((type) => {
          if (type.endsWith("/*")) {
            const [mainType] = type.split("/");
            return file.type.startsWith(mainType);
          }
          if (type.startsWith(".")) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          return file.type === type;
        });

        if (!isAccepted) {
          return `File "${file.name}" is not in accepted formats: ${acceptedFileTypes.join(", ")}`;
        }
      }

      return null;
    },
    [acceptedFileTypes, maxFileSize],
  );

  const addFiles = useCallback(
    (newFiles: File[]) => {
      const validationErrors: string[] = [];
      const validFiles: File[] = [];

      newFiles.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          validationErrors.push(error);
        } else {
          validFiles.push(file);
        }
      });

      if (!multiple && validFiles.length > 0) {
        validFiles.splice(1);
      }

      if (!multiple && files.length > 0 && validFiles.length > 0) {
        validationErrors.push(
          "Only one file allowed. Previous file will be replaced.",
        );
      }

      setErrors(validationErrors);

      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
      const finalFiles = updatedFiles.slice(0, maxFiles);
      setFiles(finalFiles);

      if (finalFiles.length > 0 && onFilesSelected) {
        onFilesSelected(finalFiles);
      }
    },
    [files, validateFile, multiple, maxFiles, onFilesSelected],
  );

  const removeFile = useCallback(
    (index: number) => {
      const file = files[index];
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      setErrors([]);

      if (onFileRemove) {
        onFileRemove(file.name);
      }
    },
    [files, onFileRemove],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    },
    [disabled, addFiles],
  );

  const value: FileDropzoneContextType = {
    files,
    isDragging,
    errors,
    disabled,
    acceptedFileTypes,
    maxFileSize,
    maxFiles,
    multiple,
    showPreview,
    addFiles,
    removeFile,
    setIsDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    fileInputRef,
    onFilesSelected,
    onFileRemove,
  };

  return (
    <FileDropzoneContext.Provider value={value}>
      {children}
    </FileDropzoneContext.Provider>
  );
}

/**
 * FileDropzone Trigger Component
 * The interactive drop area that accepts files
 */
const FileDropzoneTrigger = React.forwardRef<
  HTMLDivElement,
  FileDropzoneTriggerProps
>(({ className, onClick, ...props }, ref) => {
  const {
    isDragging,
    disabled,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    fileInputRef,
  } = useFileDropzone();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
    onClick?.(e);
  };

  return (
    <div
      ref={ref}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all duration-200 cursor-pointer",
        isDragging && !disabled
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-accent/50",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
});
FileDropzoneTrigger.displayName = "FileDropzone.Trigger";

/**
 * FileDropzone Input Component
 * Hidden file input element
 */
const FileDropzoneInput = React.forwardRef<
  HTMLInputElement,
  FileDropzoneInputProps
>(({ onChange, ...props }, ref) => {
  const { multiple, acceptedFileTypes, disabled, addFiles, fileInputRef } =
    useFileDropzone();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
      e.target.value = "";
    }
    onChange?.(e);
  };

  const acceptAttr = acceptedFileTypes?.includes("*")
    ? undefined
    : acceptedFileTypes?.join(",");

  return (
    <input
      ref={ref || fileInputRef}
      type="file"
      multiple={multiple}
      accept={acceptAttr}
      onChange={handleChange}
      disabled={disabled}
      className="hidden"
      aria-label="File input"
      {...props}
    />
  );
});
FileDropzoneInput.displayName = "FileDropzone.Input";

/**
 * FileDropzone ErrorList Component
 * Displays validation errors
 */
const FileDropzoneErrorList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { errors } = useFileDropzone();

  if (errors.length === 0) return null;

  return (
    <div
      ref={ref}
      className={cn("rounded-lg bg-destructive/10 p-4", className)}
      {...props}
    >
      <ul className="space-y-1 text-sm text-destructive">
        {errors.map((error, index) => (
          <li key={index}>• {error}</li>
        ))}
      </ul>
    </div>
  );
});
FileDropzoneErrorList.displayName = "FileDropzone.ErrorList";

/**
 * FileDropzone FileList Component
 * Container for file items
 */
const FileDropzoneFileList = React.forwardRef<
  HTMLDivElement,
  FileDropzoneFileListProps
>(({ className, children, ...props }, ref) => {
  const { files } = useFileDropzone();

  if (files.length === 0) return null;

  return (
    <div ref={ref} className={cn("space-y-3", className)} {...props}>
      <h3 className="text-sm font-semibold text-foreground">
        {files.length} file{files.length !== 1 ? "s" : ""} selected
      </h3>

      <div className="space-y-2">
        {children ||
          files.map((_, index) => (
            <FileDropzone.File key={index} index={index} />
          ))}
      </div>
    </div>
  );
});
FileDropzoneFileList.displayName = "FileDropzone.FileList";

/**
 * FileDropzone File Component
 * Individual file item
 */
const FileDropzoneFile = React.forwardRef<
  HTMLDivElement,
  FileDropzoneFileProps
>(({ index, children }, ref) => {
  const { files } = useFileDropzone();
  const file = files[index];

  if (!file) return null;

  return (
    <div
      ref={ref}
      className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
    >
      <div className="flex flex-1 items-center gap-3">
        {children || (
          <>
            <FileDropzonePreview index={index} />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </>
        )}
      </div>

      <FileDropzoneRemoveButton index={index} />
    </div>
  );
});
FileDropzoneFile.displayName = "FileDropzone.File";

/**
 * FileDropzone Preview Component
 * Displays file preview (image or icon)
 */
const FileDropzonePreview = React.forwardRef<
  HTMLDivElement,
  FileDropzonePreviewProps
>(({ index, className, ...props }, ref) => {
  const { files, showPreview } = useFileDropzone();
  const file = files[index];

  if (!file || !showPreview) return null;

  if (file.type.startsWith("image/")) {
    return (
      <div
        ref={ref}
        className={cn("relative h-24 w-24 overflow-hidden rounded", className)}
        {...props}
      >
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-24 w-24 items-center justify-center rounded bg-muted",
        className,
      )}
      {...props}
    >
      <HugeiconsIcon
        icon={File02Icon}
        size={24}
        color="currentColor"
        strokeWidth={1.5}
        className="h-8 w-8 text-muted-foreground"
      />
    </div>
  );
});
FileDropzonePreview.displayName = "FileDropzone.Preview";

/**
 * FileDropzone RemoveButton Component
 * Button to remove a file
 */
const FileDropzoneRemoveButton = React.forwardRef<
  HTMLButtonElement,
  FileDropzoneRemoveButtonProps
>(({ index, onClick, ...props }, ref) => {
  const { files, removeFile } = useFileDropzone();
  const file = files[index];

  if (!file) return null;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    removeFile(index);
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className="ml-2 rounded-md p-1 hover:bg-destructive/10 transition-colors"
      aria-label={`Remove ${file.name}`}
      type="button"
      {...props}
    >
      <HugeiconsIcon
        icon={Cancel01Icon}
        size={24}
        color="currentColor"
        strokeWidth={1.5}
        className="h-4 w-4 text-destructive"
      />
    </button>
  );
});
FileDropzoneRemoveButton.displayName = "FileDropzone.RemoveButton";

/**
 * Compound FileDropzone component with sub-components
 * Following Radix UI pattern for primitized, composable components
 */
export const FileDropzone = Object.assign(FileDropzoneRoot, {
  Root: FileDropzoneRoot,
  Trigger: FileDropzoneTrigger,
  Input: FileDropzoneInput,
  ErrorList: FileDropzoneErrorList,
  FileList: FileDropzoneFileList,
  File: FileDropzoneFile,
  Preview: FileDropzonePreview,
  RemoveButton: FileDropzoneRemoveButton,
});

export type {
  FileDropzoneErrorListProps,
  FileDropzoneFileListProps,
  FileDropzoneFileProps,
  FileDropzoneInputProps,
  FileDropzonePreviewProps,
  FileDropzoneRemoveButtonProps,
  FileDropzoneRootProps,
  FileDropzoneTriggerProps,
};
