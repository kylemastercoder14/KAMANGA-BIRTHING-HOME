import React from "react";
import db from "@/lib/db";
import { redirect } from "next/navigation";

import Client from './client';

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

  if (!data) redirect("/");
  return (
    <Client data={data} />
  );
};

export default Page;
