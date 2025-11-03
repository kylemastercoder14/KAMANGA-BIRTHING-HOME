"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { HouseholdWithProfile } from "@/types";
import { Role } from "@prisma/client";

interface HouseholdTableProps {
  data: HouseholdWithProfile[];
  userRole?: Role;
}

export function HouseholdTable({ data, userRole }: HouseholdTableProps) {
  return (
    <DataTable
      columns={columns(userRole)}
      data={data}
      searchPlaceholder="Filter household ID or number..."
    />
  );
}

