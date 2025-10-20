"use client";

import React from "react";
import { UseFormReturn, useFieldArray, Controller } from "react-hook-form";
import { ProfileFormData } from "@/validators/profile";

import { Form, FormLabel } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";

const FacilityNonFacilityBased = ({
  form,
}: {
  form: UseFormReturn<ProfileFormData>;
}) => {
  const { control, formState } = form;
  const { isSubmitting } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "facilityBasedDeliveries",
  });

  // 🧩 Automatically number each new Live Birth row
  const addRow = () => {
    const nextIndex = fields.length + 1;
    append({
      label: `Live Birth ${nextIndex}`,
      facilityMale: false,
      facilityFemale: false,
      nonFacilityMale: false,
      nonFacilityFemale: false,
    });
  };

  return (
    <Form {...form}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel className="text-base font-semibold">
            Facility-Based Delivery
          </FormLabel>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={addRow}>
              <PlusIcon size={14} className="mr-1" /> Add Row
            </Button>
            {fields.length > 0 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(fields.length - 1)}
              >
                <TrashIcon size={14} className="mr-1" /> Remove
              </Button>
            )}
          </div>
        </div>

        <Table className="border rounded-md">
          <TableCaption>
            Please tick a box to check either male or female.
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead className="text-center" colSpan={2}>
                Facility
              </TableHead>
              <TableHead className="text-center" colSpan={2}>
                Non-Facility
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="text-center">Male</TableHead>
              <TableHead className="text-center">Female</TableHead>
              <TableHead className="text-center">Male</TableHead>
              <TableHead className="text-center">Female</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {fields.map((item, index) => (
              <TableRow key={item.id}>
                {/* Live Birth Label */}
                <TableCell className="font-medium">
                  {form.watch(`facilityBasedDeliveries.${index}.label`)}
                </TableCell>

                {/* Facility Male */}
                <TableCell className="text-center">
                  <Controller
                    name={`facilityBasedDeliveries.${index}.facilityMale`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </TableCell>

                {/* Facility Female */}
                <TableCell className="text-center">
                  <Controller
                    name={`facilityBasedDeliveries.${index}.facilityFemale`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </TableCell>

                {/* Non-Facility Male */}
                <TableCell className="text-center">
                  <Controller
                    name={`facilityBasedDeliveries.${index}.nonFacilityMale`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </TableCell>

                {/* Non-Facility Female */}
                <TableCell className="text-center">
                  <Controller
                    name={`facilityBasedDeliveries.${index}.nonFacilityFemale`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Form>
  );
};

export default FacilityNonFacilityBased;
