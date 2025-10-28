import React from "react";
import db from "@/lib/db";
import { ProgramHeader } from "../_components/program-header";
import HealthProgramForm from "@/components/forms/health-program";

const Page = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const params = await props.params;

  const data = await db.healthProgram.findUnique({
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
