import React from "react";
import db from "@/lib/db";
import { ProgramHeader } from "../_components/program-header";
import HealthProgramForm from "@/components/forms/health-program";
import { useUser } from "@/hooks/use-user";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

const Page = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const params = await props.params;
  const { user } = await useUser();

  // If editing (not creating), check if user is ADMIN
  if (params.id !== "create" && user?.role !== Role.ADMIN) {
    redirect("/health-programs");
  }

  const data = params.id === "create"
    ? null
    : await db.healthProgram.findUnique({
        where: {
          id: params.id,
        },
        include: {
          sections: true,
        },
      });

  const title = !data ? "Create new program" : data.title;
  return (
    <div>
      <ProgramHeader title={title} />
      <HealthProgramForm initialData={data} />
    </div>
  );
};

export default Page;
