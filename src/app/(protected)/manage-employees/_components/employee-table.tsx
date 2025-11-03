"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { User, Role } from "@prisma/client";

interface EmployeeTableProps {
  data: User[];
  userRole?: Role;
}

export function EmployeeTable({ data, userRole }: EmployeeTableProps) {
  return (
    <DataTable
      columns={columns(userRole)}
      data={data}
      searchPlaceholder="Filter employee ID or name..."
    />
  );
}

