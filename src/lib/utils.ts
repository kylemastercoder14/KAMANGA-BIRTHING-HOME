import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

export function getFileIconAndType(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const mime = file.type;

  if (mime.startsWith("image/")) return { icon: "image", type: "image" };
  if (mime === "application/pdf" || ext === "pdf")
    return { icon: "pdf", type: "pdf" };
  if (
    mime ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    ext === "xlsx"
  )
    return { icon: "xlsx", type: "excel" };
  if (
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ext === "docx"
  )
    return { icon: "docx", type: "word" };
  if (mime.startsWith("video/")) return { icon: "video", type: "video" };
  return { icon: "file", type: "file" }; // fallback
}

export const backupTables = [
  "user",
  "systemLogs",
  "events",
  "notes",
  "houseHold",
  "profile",
  "babyData",
  "facilityBasedDelivery",
  "healthProgram",
  "programSection",
  "backupHistory",
  "fileNode",
];
