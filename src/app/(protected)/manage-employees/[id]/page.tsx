import React from "react";
import db from "@/lib/db";
import Heading from "@/components/globals/heading";
import EmployeeForm from '@/components/forms/employee';
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
    redirect("/manage-employees");
  }

  const initialData = params.id === "create"
    ? null
    : await db.user.findUnique({
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
