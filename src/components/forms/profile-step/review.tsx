/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormData } from "@/validators/profile";
import { User, Home, Heart, Baby, Utensils, PawPrint } from "lucide-react";

const ReviewSubmit = ({
  form,
}: {
  form: UseFormReturn<ProfileFormData>;
}) => {
  const values = form.getValues();

  const formatDate = (date: string | Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-700 to-green-800 px-6 py-4 flex items-center gap-3">
        <Icon className="w-5 h-5 text-white" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  const Field = ({ label, value }: any) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 py-3 border-b border-gray-100 last:border-0">
      <span className="font-medium text-gray-700 sm:w-1/3">{label}:</span>
      <span className="text-gray-900 sm:w-2/3">{value || "N/A"}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-700 rounded-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Review Your Profile</h2>
        <p className="text-green-100">
          Please review all information carefully before submitting
        </p>
      </div>

      {/* Household Information */}
      <Section title="Household Information" icon={Home}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <Field label="Household Number" value={values.householdNumber} />
          <Field
            label="Monthly Income"
            value={values.monthlyIncome ? `₱${values.monthlyIncome.toLocaleString()}` : "N/A"}
          />
          <Field label="Location" value={values.location} />
          <Field label="4Ps Member" value={values.areYou4ps ? "Yes" : "No"} />
          <Field label="IPs Member" value={values.areYouIps ? "Yes" : "No"} />
          <Field label="PWD" value={values.areYouPwd ? "Yes" : "No"} />
        </div>
      </Section>

      {/* Personal Information */}
      <Section title="Personal Information" icon={User}>
        <div className="space-y-0">
          <Field
            label="Full Name"
            value={`${values.firstName} ${values.middleName || ""} ${values.lastName}`.trim()}
          />
          <Field label="Birth Date" value={formatDate(values.birthDate)} />
          <Field label="Age" value={values.age} />
          <Field label="Sex" value={values.sex} />
          <Field label="Relationship" value={values.relationship} />
          <Field label="ODK Member" value={values.odkMember ? "Yes" : "No"} />
          <Field label="Occupation" value={values.occupation} />
          <Field label="Educational Attainment" value={values.educationalAttainment} />
          <Field label="Religion" value={values.religion} />
          <Field label="Ethnic Group" value={values.ethnicGroup} />
          <Field label="PhilHealth Number" value={values.philhealthNumber} />
        </div>
      </Section>

      {/* Emergency Contact */}
      <Section title="Emergency Contact" icon={Heart}>
        <div className="space-y-0">
          <Field label="Contact Name" value={values.emergencyContactName} />
          <Field label="Contact Number" value={values.emergencyContactNumber} />
        </div>
      </Section>

      {/* Health Information */}
      <Section title="Health Information" icon={Heart}>
        <div className="space-y-0">
          <Field label="Pregnant" value={values.areYouPregnant ? "Yes" : "No"} />
          <Field label="Sanitized Toilet" value={values.sanitizedToilet ? "Yes" : "No"} />
          {values.constructedDateToilet && (
            <Field
              label="Toilet Constructed Date"
              value={formatDate(values.constructedDateToilet)}
            />
          )}
        </div>
      </Section>

      {/* Facility Based Deliveries */}
      {values.facilityBasedDeliveries && values.facilityBasedDeliveries.length > 0 && (
        <Section title="Facility Based Deliveries" icon={Baby}>
          <div className="space-y-4">
            {values.facilityBasedDeliveries.map((delivery: any, idx: number) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">{delivery.label}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Facility-Based:</p>
                    <p className="text-gray-900">
                      Male: {delivery.facilityMale ? "✓" : "—"} | Female:{" "}
                      {delivery.facilityFemale ? "✓" : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Non-Facility:</p>
                    <p className="text-gray-900">
                      Male: {delivery.nonFacilityMale ? "✓" : "—"} | Female:{" "}
                      {delivery.nonFacilityFemale ? "✓" : "—"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Baby Data */}
      {values.babyData && values.babyData.length > 0 && (
        <Section title="Children Data" icon={Baby}>
          <div className="space-y-4">
            {values.babyData.map((baby: any, idx: number) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">{baby.label}</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Height</p>
                    <p className="text-lg font-medium text-gray-900">{baby.height} cm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="text-lg font-medium text-gray-900">{baby.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">MUAC</p>
                    <p className="text-lg font-medium text-gray-900">{baby.muac} mm</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Vegetables */}
      {values.vegetables && values.vegetables.length > 0 && (
        <Section title="Vegetables Grown" icon={Utensils}>
          <div className="flex flex-wrap gap-2">
            {values.vegetables.map((veg: string, idx: number) => (
              <span
                key={idx}
                className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                {veg}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Animals */}
      {values.animals && values.animals.length > 0 && (
        <Section title="Animals Raised" icon={PawPrint}>
          <div className="flex flex-wrap gap-2">
            {values.animals.map((animal: string, idx: number) => (
              <span
                key={idx}
                className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
              >
                {animal}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default ReviewSubmit;
