import { z } from "zod";

export const FacilityBasedDeliveryValidator = z.object({
  label: z.string(),
  facilityMale: z.boolean(),
  facilityFemale: z.boolean(),
  nonFacilityMale: z.boolean(),
  nonFacilityFemale: z.boolean(),
});

export const BabyDataValidator = z.object({
  height: z.number().min(0, "Height must be positive"),
  weight: z.number().min(0, "Weight must be positive"),
  muac: z.number().min(0, "MUAC must be positive"),
  label: z.string().optional(),
});

export const ProfileValidators = z.object({
  householdNumber: z.string().min(1, "Household number is required"),
  monthlyIncome: z.number().min(1, "Monthly income must be greater than 0"),
  areYou4ps: z.boolean(),
  areYouIps: z.boolean(),
  areYouPwd: z.boolean(),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  birthDate: z.date(),
  age: z.number().min(0, "Age must be a positive number"),
  sex: z.string().min(1, "Sex is required"),
  odkMember: z.boolean(),
  occupation: z.string().min(1, "Occupation is required"),
  educationalAttainment: z
    .string()
    .min(1, "Educational attainment is required"),
  religion: z.string().min(1, "Religion is required"),
  ethnicGroup: z.string().min(1, "Ethnic group is required"),
  philhealthNumber: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  areYouPregnant: z.boolean(),
  lastMenstrualPeriod: z.date().optional(),
  expectedDeliveryDate: z.date().optional(),
  doYouBreastfeed: z.boolean(),
  immunizedChildren: z.boolean(),
  marriedCouple: z.string().optional(),
  sanitizedToilet: z.boolean(),
  constructedDateToilet: z.date(),
  presumptiveTubercolosis: z.boolean(),
  broughtToFacility: z.boolean(),
  dwellingType: z.string().optional(),
  waterSource: z.string().optional(),
  vegetables: z.array(z.string()),
  animals: z.array(z.string()),
  bingeDrinker: z.boolean(),
  smoker: z.boolean(),
  garbageDisposal: z.string().optional(),
  hypertension: z.string().optional(),
  diabetes: z.string().optional(),
  bothSickness: z.string().optional(),
  oscaNumber: z.number().optional(),
  pwdInformation: z.string().optional(),
  facilityBasedDeliveries: z
    .array(FacilityBasedDeliveryValidator)
    .optional()
    .default([]),
  babyData: z.array(BabyDataValidator).optional().default([]),
});

export type ProfileFormData = z.infer<typeof ProfileValidators>;
