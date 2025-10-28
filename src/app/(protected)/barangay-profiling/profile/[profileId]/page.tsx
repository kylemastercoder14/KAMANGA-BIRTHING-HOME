import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import ProfileForm from "@/components/forms/profile-form";

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
