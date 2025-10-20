import {
  BabyData,
  FacilityBasedDelivery,
  HouseHold,
  Profile,
} from "@prisma/client";

export interface ProfilingProps extends Profile {
  babyData: BabyData[];
  facilityBasedDelivery: FacilityBasedDelivery[];
  household: HouseHold | null;
}
