/* eslint-disable react/no-unescaped-entities */
import React from "react";
import db from "@/lib/db";
import CreateNotes from "./_components/create-notes";
import Client from "./_components/client";
import { IconDatabaseSmile } from "@tabler/icons-react";
import { useUser } from "@/hooks/use-user";
import { redirect } from "next/navigation";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { userId } = await useUser();
  if (!userId) redirect("/sign-in");
  const data = await db.notes.findMany({
    orderBy: {
      order: "asc",
    },
  });
  return (
    <div className="min-h-screen">
      {data.length === 0 ? (
        <div className="flex h-[50vh] items-center justify-center flex-col">
          <IconDatabaseSmile className="size-20 text-primary" />
          <h3 className="font-semibold text-lg mt-3">
            Your virtual activity note board
          </h3>
          <p className="mb-5">
            Click "Add Note" to start organizing your activity and ideas!
          </p>
          <CreateNotes userId={userId} />
        </div>
      ) : (
        <Client data={data} userId={userId} />
      )}
    </div>
  );
};

export default Page;
