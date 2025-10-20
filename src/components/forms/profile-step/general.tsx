"use client";

import React, { useEffect } from "react";
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
  Choicebox,
  ChoiceboxIndicator,
  ChoiceboxItem,
  ChoiceboxItemHeader,
  ChoiceboxItemTitle,
} from "@/components/kibo-ui/choicebox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/globals/date-picker";

const gender = [
  {
    id: "male",
    label: "Male",
  },
  {
    id: "female",
    label: "Female",
  },
];

const GeneralInformation = ({
  form,
}: {
  form: UseFormReturn<ProfileFormData>;
}) => {
  const { isSubmitting } = form.formState;

  // ✅ Automatically compute age when birthDate changes
  const birthDate = form.watch("birthDate"); // 👈 watch value outside useEffect

  useEffect(() => {
    if (!birthDate) return;

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    // ✅ Update form field
    form.setValue("age", age);
  }, [birthDate, form]); // 👈 trigger when birthDate changes

  return (
    <div>
      <Form {...form}>
        <div className="space-y-6">
          <div>
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="areYou4ps"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex border border-input p-3 rounded-md items-center justify-between">
                        <div>
                          <div className="font-medium">4PS Member</div>
                          <div className="text-sm text-gray-500">
                            Are you a 4PS member?
                          </div>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="areYouIps"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex border p-3 border-input rounded-md items-center justify-between">
                        <div>
                          <div className="font-medium">IPS Member</div>
                          <div className="text-sm text-gray-500">
                            Are you an IPS member?
                          </div>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="areYouPwd"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex border p-3 border-input rounded-md items-center justify-between">
                        <div>
                          <div className="font-medium">PWD Member</div>
                          <div className="text-sm text-gray-500">
                            Are you a PWD member?
                          </div>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormDescription className="mt-1">
              Please toggle the switches if you are a member of the respective
              programs.
            </FormDescription>
          </div>

          <div className="grid lg:grid-cols-3 grid-cols-1 items-start gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      disabled={isSubmitting}
                      placeholder="Enter first name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Middle Name{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Enter middle name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Enter last name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Relationship <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    disabled={isSubmitting}
                    placeholder="What are you in the household?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid lg:grid-cols-2 grid-cols-1 items-start gap-6">
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Date of Birth <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={(val) => {
                        const date = val ? new Date(val) : undefined;
                        field.onChange(date);
                      }}
                      placeholder="Select date of birth"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Age <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      readOnly
                      disabled={isSubmitting}
                      placeholder="Age"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 items-start gap-6">
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Sex <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Choicebox
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      style={{
                        gridTemplateColumns: `repeat(${gender.length}, 1fr)`,
                      }}
                    >
                      {gender.map((option) => (
                        <ChoiceboxItem
                          className="border-input"
                          key={option.id}
                          value={option.id}
                        >
                          <ChoiceboxItemHeader>
                            <ChoiceboxItemTitle>
                              {option.label}
                            </ChoiceboxItemTitle>
                          </ChoiceboxItemHeader>
                          <ChoiceboxIndicator />
                        </ChoiceboxItem>
                      ))}
                    </Choicebox>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="odkMember"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex border border-input p-3 mt-5 rounded-md items-center justify-between">
                      <div>
                        <div className="font-medium">ODK Member</div>
                        <div className="text-sm text-gray-500">
                          Are you an ODK member?
                        </div>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 items-start gap-6">
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Occupation <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      disabled={isSubmitting}
                      placeholder="Enter occupation"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="educationalAttainment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Educational Attainment{" "}
                    <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Enter educational attainment"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 items-start gap-6">
            <FormField
              control={form.control}
              name="religion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Religion <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      disabled={isSubmitting}
                      placeholder="Enter religion"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ethnicGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ethnicity <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Enter ethnicity"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="philhealthNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Philhealth Number{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isSubmitting}
                    placeholder="Enter philhealth number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid lg:grid-cols-2 grid-cols-1 items-start gap-6">
            <FormField
              control={form.control}
              name="emergencyContactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Emergency Contact Person{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      disabled={isSubmitting}
                      placeholder="Enter emergency contact person"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyContactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Emergency Contact Number{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="Enter emergency contact number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="areYouPregnant"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex border border-input p-3 rounded-md items-center justify-between">
                    <div>
                      <div className="font-medium">Pregnancy</div>
                      <div className="text-sm text-gray-500">
                        Are you pregnant?
                      </div>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("areYouPregnant") && (
            <>
              <div className="grid lg:grid-cols-2 grid-cols-1 items-start gap-6">
                <FormField
                  control={form.control}
                  name="lastMenstrualPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last Menstrual Period{" "}
                        <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={(val) => {
                            const date = val ? new Date(val) : undefined;
                            field.onChange(date);
                          }}
                          placeholder="Select last menstrual period date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedDeliveryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Expected Delivery Date{" "}
                        <span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={(val) => {
                            const date = val ? new Date(val) : undefined;
                            field.onChange(date);
                          }}
                          placeholder="Select expected delivery date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid lg:grid-cols-2 grid-cols-1 items-start gap-6">
                <FormField
                  control={form.control}
                  name="doYouBreastfeed"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex border border-input p-3 rounded-md items-center justify-between">
                          <div>
                            <div className="font-medium">Exclusive Breastfeeding (0-6 months)</div>
                            <div className="text-sm text-gray-500">
                              Do you exclusively breastfeeding?
                            </div>
                          </div>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="immunizedChildren"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex border border-input p-3 rounded-md items-center justify-between">
                          <div>
                            <div className="font-medium">12 Months Old Immunized Children</div>
                            <div className="text-sm text-gray-500">
                              Is your 12 months old baby immunized?
                            </div>
                          </div>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
        </div>
      </Form>
    </div>
  );
};

export default GeneralInformation;
