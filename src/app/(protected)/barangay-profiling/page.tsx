import React from "react";
import db from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./_components/columns";
import Heading from "@/components/globals/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

const Page = async () => {
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
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="4ps">4PS</TabsTrigger>
            <TabsTrigger value="ips">IPS</TabsTrigger>
            <TabsTrigger value="pwd">PWD</TabsTrigger>
            <TabsTrigger value="pregnant">Pregnant</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <DataTable
              columns={columns}
              data={data}
              searchPlaceholder="Filter profile ID or name..."
            />
          </TabsContent>
          <TabsContent value="4ps">
            <DataTable
              columns={columns}
              data={data.filter((f) => f.areYou4ps)}
              searchPlaceholder="Filter profile ID or name..."
            />
          </TabsContent>
          <TabsContent value="ips">
            <DataTable
              columns={columns}
              data={data.filter((f) => f.areYouIps)}
              searchPlaceholder="Filter profile ID or name..."
            />
          </TabsContent>
          <TabsContent value="pwd">
            <DataTable
              columns={columns}
              data={data.filter((f) => f.areYouPwd)}
              searchPlaceholder="Filter profile ID or name..."
            />
          </TabsContent>
          <TabsContent value="pregnant">
            <DataTable
              columns={columns}
              data={data.filter((f) => f.areYouPregnant)}
              searchPlaceholder="Filter profile ID or name..."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
