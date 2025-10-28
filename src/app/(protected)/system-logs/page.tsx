import React from "react";
import Heading from "@/components/globals/heading";
import { columns } from "./_components/columns";
import { DataTable } from "@/components/ui/data-table";
import db from '@/lib/db';

const Page = async () => {
  const data = await db.systemLogs.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      user: true
    }
  })
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Manage System Logs"
          description="Browse all the actions by employee in your system."
        />
      </div>

      <div className="mt-5">
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Filter by employee ID or username..."
        />
      </div>
    </div>
  );
};

export default Page;
