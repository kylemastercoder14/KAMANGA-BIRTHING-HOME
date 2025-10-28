"use client";

import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from "@/components/kibo-ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Events } from "@prisma/client";

interface UpcomingEventsProps {
  events: Events[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  // ✅ Map Events from Prisma to calendar features
  const features = events.map((event) => ({
    id: event.id,
    name: event.title,
    startAt: event.start ? new Date(event.start) : new Date(),
    endAt: event.end ? new Date(event.end) : new Date(),
    status: {
      id: "default",
      name: event.allDay ? "All Day" : "Scheduled",
      color:
        event.color ||
        (event.start && new Date(event.start) < new Date()
          ? "#F97316" // orange for past events
          : "#10B981"), // green for upcoming
    },
  }));

  // 📅 Determine year range for the picker
  const earliestYear =
    features.map((f) => f.startAt.getFullYear()).sort().at(0) ??
    new Date().getFullYear();
  const latestYear =
    features.map((f) => f.endAt.getFullYear()).sort().at(-1) ??
    new Date().getFullYear();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>
          Stay updated with the latest community activities and programs
        </CardDescription>
      </CardHeader>

      <CardContent>
        <CalendarProvider>
          <CalendarDate>
            <CalendarDatePicker>
              <CalendarMonthPicker />
              <CalendarYearPicker start={earliestYear} end={latestYear} />
            </CalendarDatePicker>
            <CalendarDatePagination />
          </CalendarDate>

          <CalendarHeader />

          <CalendarBody features={features}>
            {({ feature }) => (
              <CalendarItem
                key={feature.id}
                feature={feature}
                className="rounded-md border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition"
              />
            )}
          </CalendarBody>
        </CalendarProvider>
      </CardContent>
    </Card>
  );
}

export default UpcomingEvents;
