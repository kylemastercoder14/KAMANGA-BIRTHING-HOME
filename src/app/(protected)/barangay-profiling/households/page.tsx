import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import { useUser } from "@/hooks/use-user";
import { HouseholdTable } from "./_components/household-table";

const Page = async () => {
  const { user } = await useUser();
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
        <HouseholdTable data={data} userRole={user?.role} />
      </div>
    </div>
  );
};

export default Page;
