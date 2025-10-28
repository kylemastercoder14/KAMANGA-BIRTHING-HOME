import React from "react";
import db from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./_components/columns";
import Heading from "@/components/globals/heading";

const Page = async () => {
  const data = await db.houseHold.findMany({
    orderBy: {
      householdNumber: "asc",
    },
    include: {
      profiles: true,
    },
  });
  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Barangay Households"
          description="Browse and manage all households in your barangay."
        />
      </div>
      <div className="mt-5">
        <DataTable
          columns={columns}
          data={data}
          searchPlaceholder="Filter household ID or number..."
        />
      </div>
    </div>
  );
};

export default Page;
