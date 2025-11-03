"use client";

import { Button } from "@/components/ui/button";
import { IconPrinter, IconFileDownload } from "@tabler/icons-react";
import * as XLSX from "xlsx";
import { ProfilingProps } from "@/types";
import { toast } from "sonner";

interface ExportButtonsProps {
  data: ProfilingProps[];
  tab?: string;
}

// Helper function to format date
const formatDate = (date: Date | null | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

// Helper function to format array
const formatArray = (arr: string[] | null | undefined): string => {
  if (!arr || arr.length === 0) return "N/A";
  return arr.join("; ");
};

// Helper function to format boolean
const formatBoolean = (value: boolean | null | undefined): string => {
  if (value === null || value === undefined) return "N/A";
  return value ? "Yes" : "No";
};

// Helper function to format baby data
const formatBabyData = (babyData: ProfilingProps["babyData"]): string => {
  if (!babyData || babyData.length === 0) return "N/A";
  return babyData
    .map(
      (baby, index) =>
        `Baby ${index + 1}: Weight=${baby.weight}kg, Height=${baby.height}cm, MUAC=${baby.muac}cm (${formatDate(baby.createdAt)})`
    )
    .join(" | ");
};

// Helper function to format facility based delivery
const formatFacilityDelivery = (
  facilityData: ProfilingProps["facilityBasedDelivery"]
): string => {
  if (!facilityData || facilityData.length === 0) return "N/A";
  return facilityData
    .map((facility) => {
      const parts = [`Label: ${facility.label}`];
      if (facility.facilityMale) parts.push("Facility Male");
      if (facility.facilityFemale) parts.push("Facility Female");
      if (facility.nonFacilityMale) parts.push("Non-Facility Male");
      if (facility.nonFacilityFemale) parts.push("Non-Facility Female");
      return parts.join(", ");
    })
    .join(" | ");
};

export function ExportButtons({ data, tab = "all" }: ExportButtonsProps) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Failed to open print window. Please allow popups.");
      return;
    }

    // Build comprehensive HTML with all data
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Barangay Profiling - ${tab.toUpperCase()}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 11px;
          }
          h1 {
            text-align: center;
            margin-bottom: 10px;
          }
          .summary {
            text-align: center;
            margin-bottom: 20px;
            color: #666;
          }
          .profile-section {
            page-break-inside: avoid;
            margin-bottom: 30px;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 5px;
          }
          .profile-header {
            background-color: #f2f2f2;
            padding: 10px;
            margin: -15px -15px 15px -15px;
            border-bottom: 2px solid #333;
            font-weight: bold;
            font-size: 14px;
          }
          .data-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 10px;
          }
          .data-item {
            padding: 4px 0;
          }
          .data-label {
            font-weight: bold;
            color: #555;
            display: inline-block;
            min-width: 180px;
          }
          .data-value {
            color: #333;
          }
          @media print {
            .profile-section {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <h1>Barangay Profiling - ${tab.toUpperCase()}</h1>
        <div class="summary">Total Records: ${data.length} | Generated: ${new Date().toLocaleString()}</div>
    `;

    data.forEach((profile, index) => {
      htmlContent += `
        <div class="profile-section">
          <div class="profile-header">
            Profile ${index + 1}: ${profile.firstName} ${profile.middleName || ""} ${profile.lastName} (ID: ${profile.id})
          </div>
          <div class="data-grid">
            <div class="data-item"><span class="data-label">Profile ID:</span><span class="data-value">${profile.id}</span></div>
            <div class="data-item"><span class="data-label">Full Name:</span><span class="data-value">${profile.firstName} ${profile.middleName || ""} ${profile.lastName}</span></div>
            <div class="data-item"><span class="data-label">First Name:</span><span class="data-value">${profile.firstName || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Middle Name:</span><span class="data-value">${profile.middleName || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Last Name:</span><span class="data-value">${profile.lastName || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Birth Date:</span><span class="data-value">${formatDate(profile.birthDate)}</span></div>
            <div class="data-item"><span class="data-label">Age:</span><span class="data-value">${profile.age || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Sex:</span><span class="data-value">${profile.sex === "male" ? "Male" : "Female"}</span></div>
            <div class="data-item"><span class="data-label">Relationship:</span><span class="data-value">${profile.relationship || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Occupation:</span><span class="data-value">${profile.occupation || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Educational Attainment:</span><span class="data-value">${profile.educationalAttainment || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Religion:</span><span class="data-value">${profile.religion || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Ethnic Group:</span><span class="data-value">${profile.ethnicGroup || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">ODK Member:</span><span class="data-value">${formatBoolean(profile.odkMember)}</span></div>
            <div class="data-item"><span class="data-label">PhilHealth Number:</span><span class="data-value">${profile.philhealthNumber || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Emergency Contact Name:</span><span class="data-value">${profile.emergencyContactName || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Emergency Contact Number:</span><span class="data-value">${profile.emergencyContactNumber || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">4PS:</span><span class="data-value">${formatBoolean(profile.areYou4ps)}</span></div>
            <div class="data-item"><span class="data-label">IPS:</span><span class="data-value">${formatBoolean(profile.areYouIps)}</span></div>
            <div class="data-item"><span class="data-label">PWD:</span><span class="data-value">${formatBoolean(profile.areYouPwd)}</span></div>
            <div class="data-item"><span class="data-label">PWD Information:</span><span class="data-value">${profile.pwdInformation || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">OSCA Number:</span><span class="data-value">${profile.oscaNumber || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Pregnant:</span><span class="data-value">${formatBoolean(profile.areYouPregnant)}</span></div>
            <div class="data-item"><span class="data-label">Last Menstrual Period:</span><span class="data-value">${formatDate(profile.lastMenstrualPeriod)}</span></div>
            <div class="data-item"><span class="data-label">Expected Delivery Date:</span><span class="data-value">${formatDate(profile.expectedDeliveryDate)}</span></div>
            <div class="data-item"><span class="data-label">Do You Breastfeed:</span><span class="data-value">${formatBoolean(profile.doYouBreastfeed)}</span></div>
            <div class="data-item"><span class="data-label">Immunized Children:</span><span class="data-value">${formatBoolean(profile.immunizedChildren)}</span></div>
            <div class="data-item"><span class="data-label">Married Couple:</span><span class="data-value">${profile.marriedCouple || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Sanitized Toilet:</span><span class="data-value">${profile.sanitizedToilet || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Constructed Date Toilet:</span><span class="data-value">${formatDate(profile.constructedDateToilet)}</span></div>
            <div class="data-item"><span class="data-label">Dwelling Type:</span><span class="data-value">${profile.dwellingType || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Water Source:</span><span class="data-value">${profile.waterSource || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Vegetables:</span><span class="data-value">${formatArray(profile.vegetables)}</span></div>
            <div class="data-item"><span class="data-label">Animals:</span><span class="data-value">${formatArray(profile.animals)}</span></div>
            <div class="data-item"><span class="data-label">Garbage Disposal:</span><span class="data-value">${profile.garbageDisposal || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Presumptive Tuberculosis:</span><span class="data-value">${formatBoolean(profile.presumptiveTubercolosis)}</span></div>
            <div class="data-item"><span class="data-label">Brought to Facility:</span><span class="data-value">${formatBoolean(profile.broughtToFacility)}</span></div>
            <div class="data-item"><span class="data-label">Binge Drinker:</span><span class="data-value">${formatBoolean(profile.bingeDrinker)}</span></div>
            <div class="data-item"><span class="data-label">Smoker:</span><span class="data-value">${formatBoolean(profile.smoker)}</span></div>
            <div class="data-item"><span class="data-label">Hypertension:</span><span class="data-value">${profile.hypertension || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Diabetes:</span><span class="data-value">${profile.diabetes || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Both Sickness:</span><span class="data-value">${profile.bothSickness || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Household Number:</span><span class="data-value">${profile.household?.householdNumber || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Household Location:</span><span class="data-value">${profile.household?.location || "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Monthly Income:</span><span class="data-value">${profile.household?.monthlyIncome ? `₱${profile.household.monthlyIncome.toLocaleString()}` : "N/A"}</span></div>
            <div class="data-item"><span class="data-label">Baby Data:</span><span class="data-value">${formatBabyData(profile.babyData)}</span></div>
            <div class="data-item"><span class="data-label">Facility Based Delivery:</span><span class="data-value">${formatFacilityDelivery(profile.facilityBasedDelivery)}</span></div>
            <div class="data-item"><span class="data-label">Created At:</span><span class="data-value">${formatDate(profile.createdAt)}</span></div>
            <div class="data-item"><span class="data-label">Updated At:</span><span class="data-value">${formatDate(profile.updatedAt)}</span></div>
          </div>
        </div>
      `;
    });

    htmlContent += `
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  };

  const handleExportExcel = () => {
    try {
      // Prepare comprehensive data for Excel
      const excelData = data.map((profile) => ({
        // Basic Information
        "Profile ID": profile.id || "",
        "First Name": profile.firstName || "",
        "Middle Name": profile.middleName || "",
        "Last Name": profile.lastName || "",
        "Full Name": `${profile.firstName} ${profile.middleName || ""} ${profile.lastName}`.trim(),
        "Birth Date": formatDate(profile.birthDate),
        "Age": profile.age || "",
        "Sex": profile.sex === "male" ? "Male" : "Female",
        "Relationship": profile.relationship || "",
        "Occupation": profile.occupation || "",
        "Educational Attainment": profile.educationalAttainment || "",
        "Religion": profile.religion || "",
        "Ethnic Group": profile.ethnicGroup || "",
        "ODK Member": formatBoolean(profile.odkMember),
        "PhilHealth Number": profile.philhealthNumber || "",
        "Emergency Contact Name": profile.emergencyContactName || "",
        "Emergency Contact Number": profile.emergencyContactNumber || "",

        // Classification
        "4PS": formatBoolean(profile.areYou4ps),
        "IPS": formatBoolean(profile.areYouIps),
        "PWD": formatBoolean(profile.areYouPwd),
        "PWD Information": profile.pwdInformation || "",
        "OSCA Number": profile.oscaNumber || "",
        "Pregnant": formatBoolean(profile.areYouPregnant),

        // Pregnancy Information
        "Last Menstrual Period": formatDate(profile.lastMenstrualPeriod),
        "Expected Delivery Date": formatDate(profile.expectedDeliveryDate),
        "Do You Breastfeed": formatBoolean(profile.doYouBreastfeed),
        "Immunized Children": formatBoolean(profile.immunizedChildren),
        "Married Couple": profile.marriedCouple || "",

        // Household Information
        "Household Number": profile.household?.householdNumber || "",
        "Household Location": profile.household?.location || "",
        "Monthly Income": profile.household?.monthlyIncome || "",
        "Monthly Income (Formatted)": profile.household?.monthlyIncome
          ? `₱${profile.household.monthlyIncome.toLocaleString()}`
          : "",
        "Sanitized Toilet": profile.sanitizedToilet || "",
        "Constructed Date Toilet": formatDate(profile.constructedDateToilet),
        "Dwelling Type": profile.dwellingType || "",
        "Water Source": profile.waterSource || "",
        "Vegetables": formatArray(profile.vegetables),
        "Animals": formatArray(profile.animals),
        "Garbage Disposal": profile.garbageDisposal || "",

        // Health Conditions
        "Presumptive Tuberculosis": formatBoolean(profile.presumptiveTubercolosis),
        "Brought to Facility": formatBoolean(profile.broughtToFacility),
        "Binge Drinker": formatBoolean(profile.bingeDrinker),
        "Smoker": formatBoolean(profile.smoker),
        "Hypertension": profile.hypertension || "",
        "Diabetes": profile.diabetes || "",
        "Both Sickness": profile.bothSickness || "",

        // Related Data
        "Baby Data": formatBabyData(profile.babyData),
        "Facility Based Delivery": formatFacilityDelivery(profile.facilityBasedDelivery),

        // Timestamps
        "Created At": formatDate(profile.createdAt),
        "Updated At": formatDate(profile.updatedAt),
      }));

      // Create a new workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();

      // Set column widths for better readability
      const maxWidths: { [key: string]: number } = {};
      excelData.forEach((row) => {
        Object.keys(row).forEach((key) => {
          const value = String(row[key as keyof typeof row] || "");
          const length = Math.max(value.length, key.length);
          if (!maxWidths[key] || length > maxWidths[key]) {
            maxWidths[key] = Math.min(length + 2, 50); // Cap at 50 characters
          }
        });
      });

      worksheet["!cols"] = Object.keys(excelData[0] || {}).map((key) => ({
        wch: maxWidths[key] || 15,
      }));

      XLSX.utils.book_append_sheet(workbook, worksheet, "Barangay Profiles");

      // Generate filename with timestamp
      const filename = `barangay-profiling-${tab}-${new Date()
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "")}.xlsx`;

      // Write the file
      XLSX.writeFile(workbook, filename);
      toast.success(`Exported ${data.length} records to Excel`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export to Excel");
    }
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="flex items-center gap-2"
      >
        <IconPrinter className="size-4" />
        <span className="hidden sm:inline">Print </span>
        <span>({data.length})</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportExcel}
        className="flex items-center gap-2"
      >
        <IconFileDownload className="size-4" />
        <span className="hidden sm:inline">Export Excel </span>
        <span>({data.length})</span>
      </Button>
    </div>
  );
}
