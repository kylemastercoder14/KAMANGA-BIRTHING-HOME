/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { ProfilingTabs } from "./_components/profiling-tabs";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  const { user } = await useUser();
  const data = await db.profile.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      babyData: true,
      facilityBasedDelivery: true,
      household: true,
    },
  });
  return (
    <div>
      <div className="flex lg:flex-row flex-col lg:items-center gap-3 lg:justify-between">
        <Heading
          title="Barangay Profiling"
          description="Browse and manage all profile in your barangay."
        />
        <Button size="sm">
          <Link
            href="/barangay-profiling/create"
            className="flex items-center gap-2"
          >
            <IconPlus className="size-4" />
            Create new profile
          </Link>
        </Button>
      </div>
      <div className="mt-5">
        <ProfilingTabs allData={data} userRole={user?.role} />
      </div>
    </div>
  );
};

export default Page;
