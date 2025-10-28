"use client";

import React, { useEffect, useState } from "react";
import CircularProgress from "./circular-progress";
import Image from "next/image";
import { getAllFiles } from "@/actions";

const MAX_STORAGE_MB = 1 * 1024; // ✅ 1 GB in MB

interface FileNode {
  id: string;
  name: string;
  type: string;
  icon: string;
  size: string; // example: "2 MB", "500 KB", "1 GB"
  children?: FileNode[];
}

/**
 * Converts human-readable file size (e.g. "364.59 KB", "2 MB", "1 GB") to MB
 */
function sizeToMB(size: string): number {
  if (!size) return 0;
  const [valueStr, unitRaw] = size.trim().split(" ");
  const value = parseFloat(valueStr);
  const unit = unitRaw?.toUpperCase() ?? "MB"; // assume MB if missing

  if (isNaN(value)) return 0;

  switch (unit) {
    case "GB":
      return value * 1024;
    case "MB":
      return value;
    case "KB":
      return value / 1024;
    default:
      return value; // fallback as MB
  }
}

/**
 * Recursively flattens nested file structure to a single array of all file nodes.
 */
function flattenFiles(files: FileNode[]): FileNode[] {
  const flat: FileNode[] = [];
  for (const file of files) {
    flat.push(file);
    if (file.children && file.children.length > 0) {
      flat.push(...flattenFiles(file.children));
    }
  }
  return flat;
}

const FileManagerAnalytics = () => {
  const [stats, setStats] = useState({
    total: 0,
    image: 0,
    document: 0,
    video: 0,
    spreadsheet: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const files: FileNode[] = await getAllFiles();

        // Flatten nested children
        const allFiles = flattenFiles(files).filter((f) => f.type === "file");

        let total = 0;
        let image = 0;
        let document = 0;
        let video = 0;
        let spreadsheet = 0;

        for (const file of allFiles) {
          const mb = sizeToMB(file.size);
          total += mb;

          if (["image", "jpg", "png", "jpeg"].includes(file.icon))
            image += mb;
          else if (["doc", "docx", "pdf"].includes(file.icon))
            document += mb;
          else if (["mp4", "avi", "mov", "video"].includes(file.icon))
            video += mb;
          else if (["xls", "xlsx"].includes(file.icon))
            spreadsheet += mb;
        }

        setStats({ total, image, document, video, spreadsheet });
      } catch (error) {
        console.error("Failed to load analytics:", error);
      }
    }

    fetchData();
  }, []);

  // Percentages
  const totalPercent = Math.min((stats.total / MAX_STORAGE_MB) * 100, 100);
  const imagePercent = Math.min((stats.image / MAX_STORAGE_MB) * 100, 100);
  const docPercent = Math.min((stats.document / MAX_STORAGE_MB) * 100, 100);
  const videoPercent = Math.min((stats.video / MAX_STORAGE_MB) * 100, 100);
  const sheetPercent = Math.min((stats.spreadsheet / MAX_STORAGE_MB) * 100, 100);

  const formatMax = "1 GB"; // ✅ updated label

  return (
    <div className="grid mt-3 lg:grid-cols-5 grid-cols-1 gap-5">
      {/* Total Storage */}
      <div className="border rounded-md p-3 flex items-center gap-2">
        <CircularProgress
          value={totalPercent}
          size={70}
          strokeWidth={6}
          showLabel
          labelClassName="text-xl font-bold"
          childrenLabel={<Image src="/icons/storage.svg" alt="Storage" width={30} height={30} />}
        />
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">Total Storage</h3>
          <p className="font-semibold text-primary text-lg">
            {stats.total.toFixed(2)} MB{" "}
            <span className="text-muted-foreground">of {formatMax}</span>
          </p>
        </div>
      </div>

      {/* Images */}
      <div className="border rounded-md p-3 flex items-center gap-2">
        <CircularProgress
          value={imagePercent}
          size={70}
          strokeWidth={6}
          showLabel
          labelClassName="text-xl font-bold"
          childrenLabel={<Image src="/icons/image.svg" alt="Image" width={30} height={30} />}
        />
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">Images</h3>
          <p className="font-semibold text-primary text-lg">
            {stats.image.toFixed(2)} MB{" "}
            <span className="text-muted-foreground">of {formatMax}</span>
          </p>
        </div>
      </div>

      {/* Documents */}
      <div className="border rounded-md p-3 flex items-center gap-2">
        <CircularProgress
          value={docPercent}
          size={70}
          strokeWidth={6}
          showLabel
          labelClassName="text-xl font-bold"
          childrenLabel={<Image src="/icons/documents.svg" alt="Documents" width={30} height={30} />}
        />
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">Documents</h3>
          <p className="font-semibold text-primary text-lg">
            {stats.document.toFixed(2)} MB{" "}
            <span className="text-muted-foreground">of {formatMax}</span>
          </p>
        </div>
      </div>

      {/* Videos */}
      <div className="border rounded-md p-3 flex items-center gap-2">
        <CircularProgress
          value={videoPercent}
          size={70}
          strokeWidth={6}
          showLabel
          labelClassName="text-xl font-bold"
          childrenLabel={<Image src="/icons/video.svg" alt="Video" width={30} height={30} />}
        />
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">Videos</h3>
          <p className="font-semibold text-primary text-lg">
            {stats.video.toFixed(2)} MB{" "}
            <span className="text-muted-foreground">of {formatMax}</span>
          </p>
        </div>
      </div>

      {/* Spreadsheets */}
      <div className="border rounded-md p-3 flex items-center gap-2">
        <CircularProgress
          value={sheetPercent}
          size={70}
          strokeWidth={6}
          showLabel
          labelClassName="text-xl font-bold"
          childrenLabel={<Image src="/icons/spreadsheet.svg" alt="Spreadsheet" width={30} height={30} />}
        />
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">Spreadsheets</h3>
          <p className="font-semibold text-primary text-lg">
            {stats.spreadsheet.toFixed(2)} MB{" "}
            <span className="text-muted-foreground">of {formatMax}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileManagerAnalytics;
