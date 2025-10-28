"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, ChevronsUpDown, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import CellActions from "./cell-action";
import { ProfilingProps } from "@/types";

export const columns: ColumnDef<ProfilingProps>[] = [
  {
    accessorKey: "filtered",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Resident
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
          <div>
            <span className="font-semibold">
              {raw.firstName} {raw.middleName ? raw.middleName + " " : ""}
              {raw.lastName}
            </span>
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
                    toast.success("Resident ID copied to clipboard");
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
      const firstName = (row.original.firstName ?? "").toLowerCase();
      const lastName = (row.original.lastName ?? "").toLowerCase();
      const middleName = (row.original.middleName ?? "").toLowerCase();
      const id = (row.original.id ?? "").toLowerCase();
      const householdNumber = (
        row.original.household?.householdNumber ?? ""
      ).toLowerCase();
      const search = filterValue.toLowerCase();

      return (
        firstName.includes(search) ||
        lastName.includes(search) ||
        middleName.includes(search) ||
        id.includes(search) ||
        householdNumber.includes(search)
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "household",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Household No.
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const householdNumber = row.original.household?.householdNumber;
      return (
        <div className="ml-3.5">
          <p>#{householdNumber || "N/A"}</p>
          <p className="text-xs text-muted-foreground">
            Location: {row.original?.household?.location}
          </p>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const householdNumber = row.original.household?.householdNumber ?? "";
      const householdId = row.original.household?.id ?? "";
      return (
        filterValue.includes(householdNumber) ||
        filterValue.includes(householdId)
      );
    },
  },
  {
    accessorKey: "age",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Age
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const age = row.original.age;
      return <span className="ml-3.5">{age}</span>;
    },
  },
  {
    accessorKey: "sex",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sex
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const sex = row.original.sex;
      return (
        <span className="ml-3.5 capitalize">
          {sex === "male" ? "Male" : "Female"}
        </span>
      );
    },
  },
  {
    accessorKey: "relationship",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Relationship
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const relationship = row.original.relationship;
      return <span className="ml-3.5">{relationship || "N/A"}</span>;
    },
  },
  {
    accessorKey: "occupation",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Occupation
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const occupation = row.original.occupation;
      return <span className="ml-3.5">{occupation || "N/A"}</span>;
    },
  },
  {
    accessorKey: "household.monthlyIncome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Monthly Income
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const monthlyIncome = row.original.household?.monthlyIncome;
      return (
        <span className="ml-3.5">
          {monthlyIncome ? `₱${monthlyIncome.toLocaleString()}` : "N/A"}
        </span>
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
      return <span className="ml-3.5">{startDate.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const actions = row.original;
      return <CellActions data={actions} />;
    },
  },
];
