import {
  BabyData,
  FacilityBasedDelivery,
  HealthProgram,
  HouseHold,
  Profile,
  ProgramSection,
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
  user: User | null;
}

export interface HealthProgramWithSections extends HealthProgram {
  sections: ProgramSection[];
}

export interface HouseholdWithProfile extends HouseHold {
  profiles: Profile[];
}

export interface FileNodeWithChildren {
  id: string;
  name: string;
  type: "file" | "folder";
  icon: string;
  date: Date;
  size: string;
  ownerName: string;
  ownerAvatar: string;
  parentId: string | null;
  children: FileNodeWithChildren[];
}
