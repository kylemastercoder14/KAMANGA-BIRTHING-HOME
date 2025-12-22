import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import ProfileForm from "@/components/forms/profile-form";
import { redirect } from "next/navigation";

const Page = async (props: {
  params: Promise<{
    profileId: string;
  }>;
}) => {
  const params = await props.params;

  // If editing (not creating), check if user is ADMIN
  if (params.profileId !== "create") {
    redirect("/barangay-profiling");
  }

  const data = params.profileId === "create"
    ? null
    : await db.profile.findUnique({
        where: {
          id: params.profileId,
        },
        include: {
          babyData: true,
          facilityBasedDelivery: true,
          household: true,
        },
      });
  return (
    <div>
      <Heading
        title={data ? `Edit profile` : "Create new profile"}
        description="Make sure to fill in all the required fields."
      />
      <ProfileForm initialData={data} />
    </div>
  );
};

export default Page;
