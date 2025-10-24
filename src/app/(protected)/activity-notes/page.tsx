/* eslint-disable react/no-unescaped-entities */
import React from "react";
import db from "@/lib/db";
import CreateNotes from "./_components/create-notes";
import Client from "./_components/client";
import { IconDatabaseSmile } from '@tabler/icons-react';

const Page = async () => {
  const data = await db.notes.findMany({
    orderBy: {
      order: "asc",
    },
  });

  const userId = "casf45wef343453"
  return (
    <div className="min-h-screen">
      {data.length === 0 ? (
        <div className="flex h-[50vh] items-center justify-center flex-col">
          <IconDatabaseSmile className="size-20 text-primary" />
          <h3 className="font-semibold text-lg mt-3">
            Your virtual activity note board
          </h3>
          <p className='mb-5'>Click "Add Note" to start organizing your activity and ideas!</p>
          <CreateNotes userId={userId} />
        </div>
      ) : (
        <Client data={data} userId={userId} />
      )}
    </div>
  );
};

export default Page;
