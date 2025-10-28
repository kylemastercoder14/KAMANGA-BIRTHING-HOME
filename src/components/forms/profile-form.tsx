/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { ProfilingProps } from "@/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormData, ProfileValidators } from "@/validators/profile";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HouseholdInformation from "@/components/forms/profile-step/household";
import GeneralInformation from "@/components/forms/profile-step/general";
import HealthDetails from "@/components/forms/profile-step/health";
import FacilityNonFacilityBased from "@/components/forms/profile-step/facility";
import ChildrenDetails from "@/components/forms/profile-step/children";
import ReviewSubmit from "@/components/forms/profile-step/review";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createProfile, updateProfile } from "@/actions";

const STORAGE_KEY = "kamanga-profile-form-draft";

const steps = [
  {
    id: 1,
    title: "Household Information",
    description: "Provide your household information",
  },
  {
    id: 2,
    title: "General Information",
    description: "Provide your general information",
  },
  {
    id: 3,
    title: "Health Details",
    description: "Provide your health information",
  },
  {
    id: 4,
    title: "Facility & Non-Facility Based",
    description: "Provide your facility and non-facility based information",
  },
  {
    id: 5,
    title: "Children Details",
    description: "Provide your children's information",
  },
  {
    id: 6,
    title: "Review & Submit",
    description: "Your account is created",
  },
];

const ProfileForm = ({
  initialData,
}: {
  initialData: ProfilingProps | null;
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize default values based on initialData
  const getDefaultValues = (): ProfileFormData => ({
    householdNumber: initialData?.household?.householdNumber || "",
    monthlyIncome: initialData?.household?.monthlyIncome || 0,
    location: initialData?.household?.location || "Sitio 1",
    areYou4ps: initialData?.areYou4ps ?? false,
    areYouIps: initialData?.areYouIps ?? false,
    areYouPwd: initialData?.areYouPwd ?? false,
    firstName: initialData?.firstName || "",
    middleName: initialData?.middleName || "",
    lastName: initialData?.lastName || "",
    relationship: initialData?.relationship || "",
    birthDate: initialData?.birthDate
      ? new Date(initialData.birthDate)
      : new Date(),
    age: initialData?.age || 0,
    sex: initialData?.sex || "female",
    odkMember: initialData?.odkMember ?? false,
    religion: initialData?.religion || "",
    educationalAttainment: initialData?.educationalAttainment || "",
    occupation: initialData?.occupation || "",
    ethnicGroup: initialData?.ethnicGroup || "",
    philhealthNumber: initialData?.philhealthNumber || "",
    emergencyContactName: initialData?.emergencyContactName || "",
    emergencyContactNumber: initialData?.emergencyContactNumber || "",
    areYouPregnant: initialData?.areYouPregnant ?? false,
    lastMenstrualPeriod: initialData?.lastMenstrualPeriod
      ? new Date(initialData.lastMenstrualPeriod)
      : new Date(),
    expectedDeliveryDate: initialData?.expectedDeliveryDate
      ? new Date(initialData.expectedDeliveryDate)
      : new Date(),
    doYouBreastfeed: initialData?.doYouBreastfeed ?? false,
    immunizedChildren: initialData?.immunizedChildren ?? false,
    marriedCouple: initialData?.marriedCouple || "",
    sanitizedToilet: initialData?.sanitizedToilet || "",
    constructedDateToilet: initialData?.constructedDateToilet
      ? new Date(initialData.constructedDateToilet)
      : new Date(),
    presumptiveTubercolosis: initialData?.presumptiveTubercolosis ?? false,
    broughtToFacility: initialData?.broughtToFacility ?? false,
    dwellingType: initialData?.dwellingType || "",
    waterSource: initialData?.waterSource || "",
    animals: initialData?.animals || [],
    vegetables: initialData?.vegetables || [],
    bingeDrinker: initialData?.bingeDrinker ?? false,
    smoker: initialData?.smoker ?? false,
    garbageDisposal: initialData?.garbageDisposal || "",
    hypertension: initialData?.hypertension || "",
    diabetes: initialData?.diabetes || "",
    bothSickness: initialData?.bothSickness || "",
    oscaNumber: initialData?.oscaNumber ?? 0,
    pwdInformation: initialData?.pwdInformation || "",

    facilityBasedDeliveries:
      initialData?.facilityBasedDelivery?.map((d: any) => ({
        label: d?.label ?? "Live Birth",
        facilityMale: d?.facilityMale ?? false,
        facilityFemale: d?.facilityFemale ?? false,
        nonFacilityMale: d?.nonFacilityMale ?? false,
        nonFacilityFemale: d?.nonFacilityFemale ?? false,
      })) ?? [],

    babyData:
      initialData?.babyData?.map((b: any, i: number) => ({
        label: b?.label ?? `Child ${i + 1}`,
        height: b?.height ?? 0,
        weight: b?.weight ?? 0,
        muac: b?.muac ?? 0,
      })) ?? [],
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileValidators) as Resolver<ProfileFormData>,
    defaultValues: getDefaultValues(),
    mode: "onBlur",
  });

  // Load draft from localStorage on mount
  useEffect(() => {
    // Only load draft if we're not editing an existing product
    if (!initialData) {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        try {
          const draftData = JSON.parse(savedDraft);
          form.reset(draftData);
          toast.success("Your previous draft has been loaded.");
        } catch (error) {
          console.error("Failed to load draft:", error);
        }
      }
    }
  }, [form, initialData]);

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(getDefaultValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleNext = async () => {
    let fieldsToValidate: (keyof ProfileFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["householdNumber", "monthlyIncome", "location"];
        break;
      case 2:
        fieldsToValidate = [
          "firstName",
          "lastName",
          "relationship",
          "birthDate",
          "age",
          "sex",
          "occupation",
          "educationalAttainment",
          "religion",
          "ethnicGroup",
        ];
        break;
      case 3:
        fieldsToValidate = ["sanitizedToilet", "constructedDateToilet"];
        break;
      case 4:
        fieldsToValidate = ["facilityBasedDeliveries"];
        break;
      case 5:
        break;
      case 6:
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      const currentData = form.getValues();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
        toast.success("Progress saved!");
      } catch (error) {
        console.error("Error saving draft:", error);
        toast.error("Failed to save your progress.");
      }

      if (currentStep < steps.length) {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateProfile(data, initialData.id);
        localStorage.removeItem(STORAGE_KEY);
        toast.success("Profile updated successfully");
        router.push("/barangay-profiling");
      } else {
        await createProfile(data);
        localStorage.removeItem(STORAGE_KEY);
        toast.success("Profile created successfully");
        router.push("/barangay-profiling");
      }
    } catch (error: any) {
      toast.error(
        error instanceof Error ? error.message : "Failed to process profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <HouseholdInformation form={form} />;
      case 2:
        return <GeneralInformation form={form} />;
      case 3:
        return <HealthDetails form={form} />;
      case 4:
        return <FacilityNonFacilityBased form={form} />;
      case 5:
        return <ChildrenDetails form={form} />;
      case 6:
        return <ReviewSubmit form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-6">
      {/* Step Indicator */}
      <div className="mb-6 flex items-center justify-between">
        {steps.map((step) => (
          <div
            key={step.id}
            className="relative flex flex-1 flex-col items-center"
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300",
                currentStep > step.id
                  ? "bg-green-600 text-white"
                  : currentStep === step.id
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600 dark:text-gray-600"
              )}
            >
              {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
            </div>
            <div
              className={cn(
                "mt-2 text-center text-sm font-medium",
                currentStep >= step.id
                  ? "text-gray-800 dark:text-gray-300"
                  : "text-gray-400 dark:text-gray-500"
              )}
            >
              {step.title}
            </div>
            {step.id < steps.length && (
              <div
                className={cn(
                  "absolute top-5 left-[calc(50%+20px)] h-0.5 w-[calc(100%-40px)] -translate-y-1/2 bg-gray-200 transition-colors duration-300",
                  currentStep > step.id && "bg-green-400"
                )}
              />
            )}
          </div>
        ))}
      </div>
      {/* Step Content */}
      <div className="mt-8">{renderStepContent()}</div>
      {currentStep === 6 && Object.keys(form.formState.errors).length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 font-semibold">
            Please fix the following errors:
          </p>
          <ul className="mt-2 space-y-1">
            {Object.entries(form.formState.errors).map(([field, error]) => (
              <li key={field} className="text-sm text-red-600">
                {field}: {error?.message as string}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Step Navigation */}
      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        {currentStep === 6 ? (
          // ✅ Show only when step is 6 (Review & Submit)
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        ) : (
          // ✅ Show Continue button for steps 1–5
          <Button onClick={handleNext}>
            <span>Continue</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
