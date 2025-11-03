"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { ProfilingProps } from "@/types";
import { Role } from "@prisma/client";

interface ProfilingTableProps {
  data: ProfilingProps[];
  userRole?: Role;
}

export function ProfilingTable({ data, userRole }: ProfilingTableProps) {
  return (
    <DataTable
      columns={columns(userRole)}
      data={data}
      searchPlaceholder="Filter profile ID or name..."
    />
  );
}

