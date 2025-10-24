import { addDays, setHours, setMinutes, subDays } from "date-fns";
import { CalendarEvent } from "@/types";

export const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Prenatal Checkup – Sitio 1 Mothers",
    description:
      "Monthly prenatal assessment for expectant mothers in Sitio 1.",
    start: subDays(new Date(), 10),
    end: subDays(new Date(), 10),
    allDay: true,
    color: "sky",
    location: "Birthing Home – Examination Room 1",
  },
  {
    id: "2",
    title: "Doctor’s Consultation – Dr. Maria Santos",
    description: "OB-GYN consultation and ultrasound appointments.",
    start: setMinutes(setHours(subDays(new Date(), 3), 9), 0),
    end: setMinutes(setHours(subDays(new Date(), 3), 12), 0),
    color: "emerald",
    location: "Birthing Home – Consultation Room",
  },
  {
    id: "3",
    title: "Health Education: Proper Nutrition During Pregnancy",
    description:
      "Educational talk about balanced meals and vitamin intake for pregnant women.",
    start: setMinutes(setHours(new Date(), 14), 0),
    end: setMinutes(setHours(new Date(), 16), 0),
    color: "amber",
    location: "Community Hall – Lobo Birthing Home",
  },
  {
    id: "4",
    title: "Free Checkup Day – Open for All Pregnant Women",
    description: "Free prenatal examination and vital signs monitoring.",
    start: addDays(new Date(), 1),
    end: addDays(new Date(), 1),
    allDay: true,
    color: "rose",
    location: "Birthing Home – Main Lobby",
  },
  {
    id: "5",
    title: "Midwives Meeting and Case Review",
    description:
      "Weekly meeting to discuss recent patient updates and delivery outcomes.",
    start: setMinutes(setHours(addDays(new Date(), 2), 13), 0),
    end: setMinutes(setHours(addDays(new Date(), 2), 15), 0),
    color: "orange",
    location: "Staff Conference Room",
  },
  {
    id: "6",
    title: "Expected Delivery – Baby Dela Cruz",
    description: "Estimated due date for Mrs. Dela Cruz’s delivery.",
    start: addDays(new Date(), 3),
    end: addDays(new Date(), 3),
    allDay: true,
    color: "violet",
    location: "Birthing Room 2",
  },
  {
    id: "7",
    title: "Postpartum Follow-Up Checkup",
    description:
      "Examination and counseling for mothers 2 weeks after delivery.",
    start: setMinutes(setHours(addDays(new Date(), 5), 10), 0),
    end: setMinutes(setHours(addDays(new Date(), 5), 12), 0),
    color: "sky",
    location: "Birthing Home – Room 3",
  },
  {
    id: "8",
    title: "Newborn Care and Vaccination Day",
    description: "Immunization for infants and guidance on newborn care.",
    start: addDays(new Date(), 6),
    end: addDays(new Date(), 6),
    allDay: true,
    color: "rose",
    location: "Community Health Center",
  },
  {
    id: "9",
    title: "Lamaze Class – Breathing and Relaxation Techniques",
    description:
      "Hands-on session for mothers and partners to prepare for childbirth.",
    start: setMinutes(setHours(addDays(new Date(), 7), 9), 0),
    end: setMinutes(setHours(addDays(new Date(), 7), 11), 30),
    color: "violet",
    location: "Birthing Home – Training Room",
  },
  {
    id: "10",
    title: "Barangay Health Workers Coordination Meeting",
    description:
      "Monthly coordination for maternal care outreach in nearby sitios.",
    start: setMinutes(setHours(addDays(new Date(), 10), 14), 0),
    end: setMinutes(setHours(addDays(new Date(), 10), 16), 0),
    color: "emerald",
    location: "Municipal Health Office",
  },
  {
    id: "11",
    title: "Maternal Care Orientation for First-Time Moms",
    description:
      "Orientation on pregnancy awareness, birth plans, and postnatal care.",
    start: addDays(new Date(), 12),
    end: addDays(new Date(), 12),
    allDay: true,
    color: "amber",
    location: "Birthing Home – Function Hall",
  },
  {
    id: "12",
    title: "Monthly Supply Check and Facility Sanitation",
    description:
      "Inventory check of birthing kits, vitamins, and sanitation supplies.",
    start: setMinutes(setHours(addDays(new Date(), 13), 8), 30),
    end: setMinutes(setHours(addDays(new Date(), 13), 11), 0),
    color: "orange",
    location: "Storage and Sanitation Area",
  },
  {
    id: "13",
    title: "Pregnancy Support Group Session",
    description:
      "Sharing experiences and emotional support for expectant mothers.",
    start: setMinutes(setHours(addDays(new Date(), 14), 15), 0),
    end: setMinutes(setHours(addDays(new Date(), 14), 17), 0),
    color: "rose",
    location: "Community Center – Sitio 2",
  },
];
