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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";

const ChildrenDetails = ({
  form,
}: {
  form: UseFormReturn<ProfileFormData>;
}) => {
  const { control, formState } = form;
  const { isSubmitting } = formState;

  // useFieldArray for dynamic baby data rows
  const { fields, append, remove } = useFieldArray({
    control,
    name: "babyData",
  });

  const addRow = () => {
    const nextIndex = fields.length + 1;
    append({
      height: 0,
      weight: 0,
      muac: 0,
      label: `Child ${nextIndex}`,
    });
  };

  return (
    <Form {...form}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel className="text-base font-semibold">
            6–59 Months (Children Details)
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
            Enter height, weight, and MUAC for each child.
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Height (cm)</TableHead>
              <TableHead>Weight (kg)</TableHead>
              <TableHead>MUAC (cm)</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {fields.map((item, index) => (
              <TableRow key={item.id}>
                {/* Label */}
                <TableCell className="font-medium">
                  {form.watch(`babyData.${index}.label`)}
                </TableCell>

                {/* Height */}
                <TableCell>
                  <Controller
                    name={`babyData.${index}.height`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </TableCell>

                {/* Weight */}
                <TableCell>
                  <Controller
                    name={`babyData.${index}.weight`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </TableCell>

                {/* MUAC */}
                <TableCell>
                  <Controller
                    name={`babyData.${index}.muac`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
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

export default ChildrenDetails;
