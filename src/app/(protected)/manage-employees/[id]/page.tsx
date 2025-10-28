import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import EmployeeForm from '@/components/forms/employee';

const Page = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const params = await props.params;

  const initialData = await db.user.findUnique({
    where: {
      id: params.id,
    },
  });
  return (
    <div>
      <Heading
        title={initialData ? "Edit Employee" : "Add New Employee"}
        description={
          initialData
            ? "Update the employee in your system"
            : "Create a new employee in your system"
        }
      />

	  <EmployeeForm initialData={initialData} />
    </div>
  );
};

export default Page;
