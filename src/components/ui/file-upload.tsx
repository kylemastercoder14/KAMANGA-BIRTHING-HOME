/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadCloud, Trash } from "lucide-react";
import { uploadFile, deleteFile } from "@/lib/upload-s3";

type FileUploadProps = {
  onImageUpload: (url: string) => void;
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
  folder?: string;
  uploadType?: "file" | "video" | "image";
};

const FileUpload = ({
  onImageUpload,
  defaultValue = "",
  className,
  disabled,
  folder = "birthingHome",
  uploadType = "image", // default type
}: FileUploadProps) => {
  const [fileUrl, setFileUrl] = useState<string>(defaultValue);
  const [fileKey, setFileKey] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  // --- ACCEPT & SIZE LOGIC BASED ON uploadType ---
  const getAcceptConfig = (): Record<string, string[]> => {
    switch (uploadType) {
      case "video":
        return {
          "video/mp4": [".mp4"],
          "video/quicktime": [".mov"],
          "video/webm": [".webm"],
        };
      case "file":
        return {
          "application/pdf": [".pdf"],
          "application/msword": [".doc"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            [".docx"],
          "application/vnd.ms-excel": [".xls"],
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
            ".xlsx",
          ],
        };
      case "image":
      default:
        return {
          "image/png": [".png"],
          "image/jpeg": [".jpeg", ".jpg"],
          "image/webp": [".webp"],
          "image/svg+xml": [".svg"],
          "image/avif": [".avif"],
        };
    }
  };

  const getMaxFileSize = () => {
    switch (uploadType) {
      case "video":
        return 50 * 1024 * 1024; // 50MB
      case "file":
        return 10 * 1024 * 1024; // 10MB
      default:
        return 5 * 1024 * 1024; // 5MB
    }
  };

  useEffect(() => {
    setFileUrl(defaultValue);
    if (defaultValue && uploadType === "image") {
      const img = new Image();
      img.src = defaultValue;
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
    }
  }, [defaultValue, uploadType]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: getAcceptConfig(),
    maxFiles: 1,
    multiple: false,
    onDrop: async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // --- Size check ---
      if (file.size > getMaxFileSize()) {
        toast.error(
          `File exceeds the ${getMaxFileSize() / (1024 * 1024)}MB limit.`
        );
        return;
      }

      // --- Preview only for images ---
      if (uploadType === "image") {
        const previewUrl = URL.createObjectURL(file);
        setFileUrl(previewUrl);

        const img = new Image();
        img.src = previewUrl;
        img.onload = () => {
          setImageDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        };
      }

      try {
        setIsUploading(true);
        toast.loading("Uploading...");

        const { url, key } = await uploadFile(file, folder, (progress) => {
          console.log("Upload progress:", progress);
        });

        setFileUrl(url);
        setFileKey(key);
        onImageUpload(url);

        toast.success("Upload successful!");
      } catch (error) {
        console.error("Upload error:", error);
        setFileUrl("");
        toast.error("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
        toast.dismiss();
      }
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach(({ errors }) => {
        errors.forEach((error) => toast.error(error.message));
      });
    },
  });

  const handleRemove = async () => {
    if (!fileUrl || !fileKey) {
      setFileUrl("");
      onImageUpload("");
      return;
    }

    try {
      await deleteFile(fileKey);
      toast.success("File removed successfully.");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to remove file.");
    }

    setFileUrl("");
    setFileKey("");
    onImageUpload("");
  };

  return (
    <div className={cn("relative", className)}>
      {!fileUrl ? (
        <div
          {...getRootProps({
            className: `w-full h-[200px] border-2 rounded-md border-dashed border-input flex flex-col items-center justify-center text-center p-4 ${
              disabled || isUploading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`,
          })}
        >
          <input {...getInputProps()} disabled={disabled || isUploading} />
          <UploadCloud className="w-6 h-6 text-muted-foreground" />
          <p className="mt-2 font-medium text-sm dark:text-white text-black mb-1">
            Drag & drop {uploadType} here
          </p>
          <p className="text-xs text-muted-foreground">
            Or click to browse (1 file, up to {getMaxFileSize() / (1024 * 1024)}
            MB)
          </p>
          <Button
            variant="secondary"
            type="button"
            size="sm"
            className="mt-2"
            disabled={disabled || isUploading}
          >
            {isUploading ? "Uploading..." : "Browse files"}
          </Button>
        </div>
      ) : (
        <div className="relative flex items-center justify-center w-full h-auto min-h-[200px] border border-input rounded-md overflow-hidden">
          <div className="relative p-4 w-full flex justify-center">
            {uploadType === "image" ? (
              <img
                src={fileUrl}
                alt="Uploaded"
                className="max-w-full max-h-[400px] object-contain"
                style={{
                  width:
                    imageDimensions.width > imageDimensions.height
                      ? "100%"
                      : "auto",
                  height:
                    imageDimensions.height > imageDimensions.width
                      ? "100%"
                      : "auto",
                }}
              />
            ) : uploadType === "video" ? (
              <video controls className="max-w-full max-h-[400px]">
                <source src={fileUrl} />
              </video>
            ) : (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                View uploaded file
              </a>
            )}
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="absolute top-4 right-4 z-10"
              onClick={handleRemove}
              disabled={disabled || isUploading}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
