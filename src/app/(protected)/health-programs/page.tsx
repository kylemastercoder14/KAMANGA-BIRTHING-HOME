import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import db from "@/lib/db";
import Link from "next/link";
import ProgramsGrid from './_components/programs-grid';
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  const { user } = await useUser();
  const data = await db.healthProgram.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      sections: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Health Programs</h1>

        <Link href="/health-programs/create">
          <Button>
            <PlusCircle className="size-4 mr-2" />
            Add Program
          </Button>
        </Link>
      </div>

      {/* Filter + Grid (Client-Side Controlled) */}
      <ProgramsGrid data={data} userRole={user?.role} />
    </div>
  );
};

export default Page;
