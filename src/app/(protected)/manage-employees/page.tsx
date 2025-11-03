/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import Heading from "@/components/globals/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { EmployeeTable } from "./_components/employee-table";
import db from "@/lib/db";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  const { user } = await useUser();
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
        <EmployeeTable data={data} userRole={user?.role} />
      </div>
    </div>
  );
};

export default Page;
