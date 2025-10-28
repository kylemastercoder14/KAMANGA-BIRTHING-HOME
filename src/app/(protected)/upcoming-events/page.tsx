"use client";

import React, { useEffect, useState } from "react";
import { EventCalendar } from "./_components";
import { Events } from "@prisma/client";
import { deleteEvent, getEvents } from "@/actions";
import { toast } from 'sonner';

const Page = () => {
  const [events, setEvents] = useState<Events[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents(); // call server action
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventUpdate = (updatedEvent: Events) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  };

  const handleEventDelete = async (eventId: string) => {
    try {
      const res = await deleteEvent(eventId);

      if (res.success) {
        setEvents((prev) => prev.filter((event) => event.id !== eventId));
      } else {
        console.error(res.error);
        toast.error(res.error);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Something went wrong while deleting.");
    }
  };

  if (loading) {
    return <div className="p-4 text-muted-foreground">Loading events...</div>;
  }
  return (
    <div>
      <EventCalendar
        events={events}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
      />
    </div>
  );
};

export default Page;
