import React from "react";
import { EventCalendarClient } from "./_components/event-calendar-client";
import { getEvents } from "@/actions";
import { useUser } from "@/hooks/use-user";

const Page = async () => {
  const { user } = await useUser();
  const events = await getEvents();

  return (
    <div>
      <EventCalendarClient events={events} userRole={user?.role} />
    </div>
  );
};

export default Page;
