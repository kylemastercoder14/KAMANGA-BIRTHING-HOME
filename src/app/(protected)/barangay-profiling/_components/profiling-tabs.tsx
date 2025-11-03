"use client";

import { useState } from "react";
import { ProfilingTable } from "./profiling-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportButtons } from "./export-buttons";
import { ProfilingProps } from "@/types";
import { Role } from "@prisma/client";

interface ProfilingTabsProps {
  allData: ProfilingProps[];
  userRole?: Role;
}

export function ProfilingTabs({ allData, userRole }: ProfilingTabsProps) {
  const [activeTab, setActiveTab] = useState("all");

  const getFilteredData = (tab: string) => {
    switch (tab) {
      case "4ps":
        return allData.filter((f) => f.areYou4ps);
      case "ips":
        return allData.filter((f) => f.areYouIps);
      case "pwd":
        return allData.filter((f) => f.areYouPwd);
      case "pregnant":
        return allData.filter((f) => f.areYouPregnant);
      default:
        return allData;
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="4ps">4PS</TabsTrigger>
          <TabsTrigger value="ips">IPS</TabsTrigger>
          <TabsTrigger value="pwd">PWD</TabsTrigger>
          <TabsTrigger value="pregnant">Pregnant</TabsTrigger>
        </TabsList>
        <ExportButtons data={getFilteredData(activeTab)} tab={activeTab} />
      </div>
      <TabsContent value="all">
        <ProfilingTable data={allData} userRole={userRole} />
      </TabsContent>
      <TabsContent value="4ps">
        <ProfilingTable data={allData.filter((f) => f.areYou4ps)} userRole={userRole} />
      </TabsContent>
      <TabsContent value="ips">
        <ProfilingTable data={allData.filter((f) => f.areYouIps)} userRole={userRole} />
      </TabsContent>
      <TabsContent value="pwd">
        <ProfilingTable data={allData.filter((f) => f.areYouPwd)} userRole={userRole} />
      </TabsContent>
      <TabsContent value="pregnant">
        <ProfilingTable data={allData.filter((f) => f.areYouPregnant)} userRole={userRole} />
      </TabsContent>
    </Tabs>
  );
}

