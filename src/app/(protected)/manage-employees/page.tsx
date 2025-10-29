import React from "react";
import Heading from "@/components/globals/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { columns } from "./_components/columns";
import { DataTable } from "@/components/ui/data-table";
import db from "@/lib/db";

const Page = async () => {
  const data = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div>
      <div className="flex lg:flex-row flex-col lg:items-center gap-3 lg:justify-between">
        <Heading
          title="Employee Management"
          description="Browse and manage all employees in your system."
        />
        <Button size="sm">
          <Link
            href="/manage-employees/create"
            className="flex items-center gap-2"
          >
            <IconPlus className="size-4" />
            Create new employee
          </Link>
        </Button>
      </div>

      <div className="mt-5">
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Filter employee ID or name..."
        />
      </div>
    </div>
  );
};

export default Page;
