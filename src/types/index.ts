import {
  BabyData,
  FacilityBasedDelivery,
  HouseHold,
  Profile,
  SystemLogs,
  User,
} from "@prisma/client";

export type CalendarView = "month" | "week" | "day" | "agenda";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: EventColor;
  location?: string;
}

export type EventColor =
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "orange";

export interface ProfilingProps extends Profile {
  babyData: BabyData[];
  facilityBasedDelivery: FacilityBasedDelivery[];
  household: HouseHold | null;
}

export interface LogsWithUser extends SystemLogs {
  user: {
    username: string;
    id: string;
    image: string;
  };
}
