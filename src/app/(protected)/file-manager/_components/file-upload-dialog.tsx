"use client";

import * as React from "react";
import { Upload, UploadIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileNode } from "@/actions";
import { getFileIconAndType } from '@/lib/utils';
import { toast } from 'sonner';

interface FileUploadDialogProps {
  parentId?: string;
  refreshFiles?: () => void;
}

export function FileUploadDialog({
  parentId,
  refreshFiles,
}: FileUploadDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragActive, setDragActive] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleFiles = (fileList: FileList) => {
    setFiles((prev) => [...prev, ...Array.from(fileList)]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        const { icon } = getFileIconAndType(file);

        await createFileNode({
          name: file.name,
          type: "file",
          icon,
          parentId: parentId,
          size: `${(file.size / 1024).toFixed(2)} KB`,
        });
      }

      toast.success(`${files.length} file(s) uploaded successfully`);
      setFiles([]);
      setOpen(false);

      // Call refresh callback if provided
      if (refreshFiles) {
        refreshFiles();
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <UploadIcon /> Upload
      </Button>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Drag and drop files here or click to select files
          </DialogDescription>
        </DialogHeader>

        <div
          className={`mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 ${
            dragActive ? "bg-muted" : ""
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload className="mx-auto size-10 opacity-25" aria-hidden="true" />
            <div className="mt-4 flex text-sm leading-none">
              <Label htmlFor="file-upload" className="relative cursor-pointer">
                <span>Upload a file</span>
                <Input
                  id="file-upload"
                  type="file"
                  className="sr-only h-auto p-0"
                  onChange={handleChange}
                  multiple
                />
              </Label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-muted-foreground text-xs leading-5">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div>
            <h4 className="text-sm">Selected Files</h4>
            <ul className="divide mt-2 divide-y rounded-md border">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-2 pr-2 pl-4 text-sm leading-6"
                >
                  <div className="flex w-0 flex-1 items-center">
                    <div className="flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">{file.name}</span>
                      <span className="text-muted-foreground shrink-0">
                        {(file.size / 1024).toFixed(2)} kb
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                    >
                      <XIcon />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
          >
            {uploading ? "Uploading..." : "Start Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
