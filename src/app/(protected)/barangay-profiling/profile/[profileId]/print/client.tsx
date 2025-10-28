"use client";

import React, { useEffect, useRef } from "react";
import { ProfilingProps } from "@/types";

const PrintProfileClient = ({
  profile,
}: {
  profile: ProfilingProps | null;
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile && printRef.current) {
      const printWindow = window.open("", "_blank", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(
          "<html><head><title>Resident Biodata</title>"
        );
        printWindow.document.write(`
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1, h2 { margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
            th, td { border: 1px solid #333; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; }
            .section { margin-bottom: 20px; }
          </style>
        `);
        printWindow.document.write(printRef.current.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  }, [profile]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div
      ref={printRef}
      className="p-8 max-w-4xl mx-auto bg-white text-gray-800"
    >
      <h1 className="text-3xl font-bold text-center mb-8">Resident Biodata</h1>

      {/* Personal Information */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-1">
          Personal Information
        </h2>
        <table className="min-w-full table-auto border border-gray-300">
          <tbody>
            <tr className="border-b border-gray-300">
              <th className="text-left px-4 py-2 bg-gray-100">Name</th>
              <td className="px-4 py-2">
                {profile.firstName} {profile.middleName ?? ""}{" "}
                {profile.lastName}
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left px-4 py-2 bg-gray-100">Age</th>
              <td className="px-4 py-2">{profile.age}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left px-4 py-2 bg-gray-100">Sex</th>
              <td className="px-4 py-2">{profile.sex}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left px-4 py-2 bg-gray-100">Birth Date</th>
              <td className="px-4 py-2">
                {new Date(profile.birthDate).toLocaleDateString()}
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left px-4 py-2 bg-gray-100">Relationship</th>
              <td className="px-4 py-2">{profile.relationship}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left px-4 py-2 bg-gray-100">Occupation</th>
              <td className="px-4 py-2">{profile.occupation ?? "N/A"}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left px-4 py-2 bg-gray-100">
                Educational Attainment
              </th>
              <td className="px-4 py-2">
                {profile.educationalAttainment ?? "N/A"}
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left px-4 py-2 bg-gray-100">Religion</th>
              <td className="px-4 py-2">{profile.religion ?? "N/A"}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left px-4 py-2 bg-gray-100">Ethnic Group</th>
              <td className="px-4 py-2">{profile.ethnicGroup ?? "N/A"}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left px-4 py-2 bg-gray-100">
                Philhealth Number
              </th>
              <td className="px-4 py-2">{profile.philhealthNumber ?? "N/A"}</td>
            </tr>
            <tr>
              <th className="text-left px-4 py-2 bg-gray-100">
                Emergency Contact
              </th>
              <td className="px-4 py-2">
                {profile.emergencyContactName ?? "N/A"} (
                {profile.emergencyContactNumber ?? "N/A"})
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Household Information */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-1">
          Household Information
        </h2>
        <table className="min-w-full table-auto border border-gray-300">
          <tbody>
            <tr className="border-b border-gray-300">
              <th className="text-left px-4 py-2 bg-gray-100">Household No</th>
              <td className="px-4 py-2">
                {profile.household?.householdNumber ?? "N/A"}
              </td>
            </tr>
            <tr className="border-b border-gray-300">
              <th className="text-left px-4 py-2 bg-gray-100">Location</th>
              <td className="px-4 py-2">
                {profile.household?.location ?? "N/A"}
              </td>
            </tr>
            <tr>
              <th className="text-left px-4 py-2 bg-gray-100">
                Monthly Income
              </th>
              <td className="px-4 py-2">
                {profile.household?.monthlyIncome
                  ? `₱${profile.household.monthlyIncome.toLocaleString()}`
                  : "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Health & Facilities */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-1">
          Health & Facilities
        </h2>
        <table className="min-w-full table-auto border border-gray-300">
          <tbody>
            {[
              ["4PS", profile.areYou4ps ? "Yes" : "No"],
              ["IPS", profile.areYouIps ? "Yes" : "No"],
              ["PWD", profile.areYouPwd ? "Yes" : "No"],
              ["Pregnant", profile.areYouPregnant ? "Yes" : "No"],
              ["Breastfeeding", profile.doYouBreastfeed ? "Yes" : "No"],
              ["Sanitized Toilet", profile.sanitizedToilet],
              [
                "Constructed Date Toilet",
                profile.constructedDateToilet
                  ? new Date(profile.constructedDateToilet).toLocaleDateString()
                  : "N/A",
              ],
              [
                "Presumptive Tuberculosis",
                profile.presumptiveTubercolosis ? "Yes" : "No",
              ],
              ["Brought to Facility", profile.broughtToFacility ? "Yes" : "No"],
              ["Dwelling Type", profile.dwellingType ?? "N/A"],
              ["Water Source", profile.waterSource ?? "N/A"],
              ["Vegetables", profile.vegetables.join(", ") || "N/A"],
              ["Animals", profile.animals.join(", ") || "N/A"],
              ["Binge Drinker", profile.bingeDrinker ? "Yes" : "No"],
              ["Smoker", profile.smoker ? "Yes" : "No"],
              ["Garbage Disposal", profile.garbageDisposal ?? "N/A"],
              ["Hypertension", profile.hypertension ?? "N/A"],
              ["Diabetes", profile.diabetes ?? "N/A"],
              ["Both Sickness", profile.bothSickness ? "Yes" : "No"],
              ["OSCA Number", profile.oscaNumber ?? "N/A"],
              ["PWD Information", profile.pwdInformation ?? "N/A"],
            ].map(([label, value], index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <th className="text-left px-4 py-2">{label}</th>
                <td className="px-4 py-2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Facility Based Delivery */}
      {profile.facilityBasedDelivery.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-1">
            Facility Based Delivery
          </h2>
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Label</th>
                <th className="px-4 py-2">Facility Male</th>
                <th className="px-4 py-2">Facility Female</th>
                <th className="px-4 py-2">Non-Facility Male</th>
                <th className="px-4 py-2">Non-Facility Female</th>
              </tr>
            </thead>
            <tbody>
              {profile.facilityBasedDelivery.map((f) => (
                <tr key={f.id} className="even:bg-gray-50">
                  <td className="px-4 py-2">{f.label}</td>
                  <td className="px-4 py-2">{f.facilityMale ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">
                    {f.facilityFemale ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2">
                    {f.nonFacilityMale ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2">
                    {f.nonFacilityFemale ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Baby Data */}
      {profile.babyData.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-1">
            Baby Data
          </h2>
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Weight (kg)</th>
                <th className="px-4 py-2">Height (cm)</th>
                <th className="px-4 py-2">MUAC (cm)</th>
              </tr>
            </thead>
            <tbody>
              {profile.babyData.map((b) => (
                <tr key={b.id} className="even:bg-gray-50">
                  <td className="px-4 py-2">{b.weight}</td>
                  <td className="px-4 py-2">{b.height}</td>
                  <td className="px-4 py-2">{b.muac}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default PrintProfileClient;
