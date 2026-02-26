/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormData } from "@/validators/profile";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Combobox,
  ComboboxContent,
  ComboboxCreateNew,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/kibo-ui/combobox";
import { Input } from "@/components/ui/input";
import { HouseHold } from "@prisma/client";
import { toast } from "sonner";
import { createNewHousehold, getAllHouseholds } from "@/actions";

const HouseholdInformation = ({
  form,
}: {
  form: UseFormReturn<ProfileFormData>;
}) => {
  const { isSubmitting } = form.formState;
  const [houseHold, setHouseHold] = useState<HouseHold[]>([]);
  const [fetchingHouseHold, setFetchingHouseHold] = useState<boolean>(false);
  const [creatingHouseHold, setCreatingHouseHold] = useState<boolean>(false);

  // ✅ Watch for householdNumber field changes
  const householdNumber = form.watch("householdNumber");

  useEffect(() => {
    // Fetch household data from the API
    const fetchHouseholds = async () => {
      setFetchingHouseHold(true);
      try {
        const response = await getAllHouseholds();
        if (response.error) {
          toast.error(response.error);
          return;
        }

        if (response.data) {
          setHouseHold(response.data);
        }
      } catch (error) {
        console.error("Error fetching households:", error);
        toast.error("Failed to load household data. Please try again later.");
      } finally {
        setFetchingHouseHold(false);
      }
    };

    fetchHouseholds();
  }, []);

  useEffect(() => {
    if (!householdNumber) return;

    const existing = houseHold.find(
      (h) => h.householdNumber === householdNumber
    );

    const currentIncome = form.getValues("monthlyIncome");

    // ✅ Only set monthlyIncome if it hasn’t been filled (e.g., freshly selected household)
    if (
      (currentIncome === null ||
        currentIncome === undefined ||
        currentIncome === 0) &&
      existing
    ) {
      form.setValue("monthlyIncome", existing.monthlyIncome ?? 0);
    } else if (
      !existing &&
      (currentIncome === null || currentIncome === undefined)
    ) {
      form.setValue("monthlyIncome", null as any);
    }
  }, [householdNumber, houseHold, form]);

  const handleCreateNew = async (newValue: string) => {
    setCreatingHouseHold(true);
    try {
      const response = await createNewHousehold(newValue);
      if (response.error) {
        toast.error(response.error);
        return;
      }

      if (response.data) {
        setHouseHold((prev) => [...prev, response.data]);
        form.setValue("householdNumber", newValue);
        // ✅ When new created, ensure monthlyIncome is null
        form.setValue("monthlyIncome", null as any);
        form.setValue("location", null as any);
      }
    } catch (error) {
      console.error("Error creating new household:", error);
      toast.error("Failed to create new household. Please try again later.");
    } finally {
      setCreatingHouseHold(false);
    }
  };

  const formattedHouseholds = houseHold.map((house) => ({
    value: house.householdNumber,
    label: house.householdNumber,
  }));

  const locations = [
    {
      value: "Sitio Looc",
      label: "Sitio Looc",
    },
    {
      value: "Sitio Tampuan",
      label: "Sitio Tampuan",
    },
    {
      value: "Sitio Talucao",
      label: "Sitio Talucao",
    },
    {
      value: "Sitio Mangelen 1",
      label: "Sitio Mangelen 1",
    },
    {
      value: "Sitio Mangelen 2",
      label: "Sitio Mangelen 2",
    },
    {
      value: "Proper Kamanga",
      label: "Proper Kamanga",
    },
    {
      value: "Sitio Taliac New",
      label: "Sitio Taliac New",
    },
    {
      value: "Sitio Taliac Old",
      label: "Sitio Taliac Old",
    },
    {
      value: "Sitio Riverside",
      label: "Sitio Riverside",
    },
    {
      value: "Sitio Riverside Upper",
      label: "Sitio Riverside Upper",
    },
    {
      value: "Sitio Seniil",
      label: "Sitio Seniil",
    },
    {
      value: "Sitio Libas",
      label: "Sitio Libas",
    },
    {
      value: "Sitio Lamlangil",
      label: "Sitio Lamlangil",
    },
    {
      value: "Sitio Pepe",
      label: "Sitio Pepe",
    },
  ];
  return (
    <div>
      <Form {...form}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="householdNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Household Number <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Combobox
                    data={formattedHouseholds}
                    onValueChange={field.onChange}
                    type="Household"
                    value={field.value}
                  >
                    <ComboboxTrigger
                      disabled={
                        fetchingHouseHold || isSubmitting || creatingHouseHold
                      }
                      className="w-full"
                    />
                    <ComboboxContent
                      filter={(value, search) => {
                        // Use exact substring matching instead of fuzzy matching
                        // This ensures "010LAM" won't match "001LAM"
                        const item = formattedHouseholds.find(
                          (h) => h.value === value
                        );
                        if (!item) return 0;
                        return item.value
                          .toLowerCase()
                          .includes(search.toLowerCase())
                          ? 1
                          : 0;
                      }}
                    >
                      <ComboboxInput />
                      <ComboboxEmpty>
                        <ComboboxCreateNew onCreateNew={handleCreateNew} />
                      </ComboboxEmpty>
                      <ComboboxList>
                        <ComboboxGroup>
                          {formattedHouseholds.map((household) => (
                            <ComboboxItem
                              key={household.value}
                              value={household.value}
                            >
                              {household.label}
                            </ComboboxItem>
                          ))}
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Location <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Combobox
                    data={locations}
                    onValueChange={field.onChange}
                    type="Location"
                    value={field.value}
                  >
                    <ComboboxTrigger
                      disabled={isSubmitting}
                      className="w-full"
                    />
                    <ComboboxContent>
                      <ComboboxInput />
                      <ComboboxEmpty />
                      <ComboboxList>
                        <ComboboxGroup>
                          {locations
                            .sort((a, b) => a.label.localeCompare(b.label))
                            .map((location) => (
                              <ComboboxItem
                                key={location.value}
                                value={location.value}
                              >
                                {location.label}
                              </ComboboxItem>
                            ))}
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="monthlyIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Monthly Income (₱) <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter monthly income"
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        field.onChange(null);
                        return;
                      }

                      field.onChange(Number(value));
                    }}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Please enter your total household monthly income in Peso.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
};

export default HouseholdInformation;
