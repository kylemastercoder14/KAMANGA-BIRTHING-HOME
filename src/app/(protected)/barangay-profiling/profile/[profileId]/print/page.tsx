import React from "react";
import db from "@/lib/db";
import PrintProfileClient from "./client";

const Page = async (props: {
  params: Promise<{
    profileId: string;
  }>;
}) => {
  const params = await props.params;

  const data = await db.profile.findUnique({
    where: {
      id: params.profileId,
    },
    include: {
      babyData: true,
      facilityBasedDelivery: true,
      household: true,
    },
  });

  return <PrintProfileClient profile={data} />;
};

export default Page;
