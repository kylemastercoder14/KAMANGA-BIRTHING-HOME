"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, ChevronsUpDown, CopyIcon, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import CellActions from "./cell-action";
import Image from "next/image";
import { User, Role } from "@prisma/client";

export const columns = (userRole?: Role): ColumnDef<User>[] => [
  {
    accessorKey: "filtered",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Employee
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const raw = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [copied, setCopied] = useState(false);
      return (
        <div className="flex items-center gap-2 ml-2.5">
          <div className="relative w-10 h-10">
            <Image
              className="object-cover rounded-md"
              fill
              src={raw.image || ""}
              alt={raw.name}
            />
          </div>
          <div>
            <span className="font-semibold">{raw.name}</span>
            <div
              title={raw.id}
              className="text-xs cursor-pointer text-primary gap-2 flex items-center"
            >
              <span className="w-[180px] hover:underline truncate overflow-hidden whitespace-nowrap">
                {raw.id}
              </span>
              {copied ? (
                <CheckIcon className="size-3 text-green-600" />
              ) : (
                <CopyIcon
                  onClick={() => {
                    navigator.clipboard.writeText(raw.id || "");
                    toast.success("User ID copied to clipboard");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="size-3 text-muted-foreground cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const name = (row.original.name ?? "").toLowerCase();
      const id = (row.original.id ?? "").toLowerCase();
      const search = filterValue.toLowerCase();

      return name.includes(search) || id.includes(search);
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const username = row.original.username;
      return <span className="ml-3.5">{username || "N/A"}</span>;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const role = row.original.role;
      return <span className="ml-3.5">{role || "N/A"}</span>;
    },
  },
  {
    accessorKey: "biodata",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Biodata
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const biodataUrl = row.original.biodata;
      const name = row.original.name;

      const handlePrint = () => {
        if (!biodataUrl) {
          toast.error("No biodata file available.");
          return;
        }

        const printWindow = window.open(biodataUrl, "_blank");
        if (printWindow) {
          const checkLoaded = setInterval(() => {
            if (printWindow.document.readyState === "complete") {
              clearInterval(checkLoaded);
              printWindow.focus();
              printWindow.print();
            }
          }, 500);
        } else {
          toast.error("Failed to open biodata file.");
        }
      };

      // Extract filename from URL (e.g., "17613219954515-zq4a7s6ue3e-CRITERIA.pdf")
      const fileName = biodataUrl
        ? decodeURIComponent(biodataUrl.split("/").pop() || "")
        : "No File";

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="link"
            className="flex items-center"
            onClick={handlePrint}
          >
            <Printer className="size-4" />
            <span
              className="text-sm truncate max-w-[300px]"
              title={fileName}
            >
              {fileName || name}
            </span>
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Created
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const startDate = new Date(row.original.createdAt);
      return (
        <span className="ml-3.5">{`${startDate.toLocaleDateString()}`}</span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Actions
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const actions = row.original;
      return <CellActions data={actions} userRole={userRole} />;
    },
  },
];
