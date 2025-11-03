"use client";

import React, { useState } from "react";
import { EventCalendar } from "./event-calendar";
import { Events } from "@prisma/client";
import { deleteEvent } from "@/actions";
import { toast } from 'sonner';
import { Role } from "@prisma/client";

interface EventCalendarClientProps {
  events: Events[];
  userRole?: Role;
}

export function EventCalendarClient({ events: initialEvents, userRole }: EventCalendarClientProps) {
  const [events, setEvents] = useState(initialEvents);
  const isAdmin = userRole === Role.ADMIN;

  const handleEventUpdate = (updatedEvent: Events) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  };

  const handleEventDelete = async (eventId: string) => {
    if (!isAdmin) {
      toast.error("Unauthorized: Only administrators can delete events");
      return;
    }

    try {
      const res = await deleteEvent(eventId);

      if (res.success) {
        setEvents((prev) => prev.filter((event) => event.id !== eventId));
        toast.success("Event deleted successfully");
      } else {
        console.error(res.error);
        toast.error(res.error || "Failed to delete event");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Something went wrong while deleting.");
    }
  };

  return (
    <EventCalendar
      events={events}
      onEventUpdate={handleEventUpdate}
      onEventDelete={isAdmin ? handleEventDelete : undefined}
      userRole={userRole}
    />
  );
}

