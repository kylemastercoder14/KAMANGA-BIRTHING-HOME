/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use server";

import db from "@/lib/db";
import z from "zod";
import { noteSchema } from "@/validators/note";
import { employeeSchema } from "@/validators/employee";
import { cookies } from "next/headers";
import * as jose from "jose";
import { useUser } from "@/hooks/use-user";
import { healthProgramSchema } from "@/validators/health-program";
import { ProfileFormData, ProfileValidators } from "@/validators/profile";
import { FileNodeWithChildren } from "@/types";
import { requireAdmin, isAdmin } from "@/lib/auth";
import { Role } from "@prisma/client";

async function logSystemAction(
  action: string,
  details: string,
  userId?: string | null
) {
  try {
    await db.systemLogs.create({
      data: {
        action,
        details,
        userId: userId ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to log system action:", error);
  }
}

export const signIn = async (username: string, password: string) => {
  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  try {
    const user = await db.user.findUnique({ where: { username } });

    if (!user) {
      return { error: "User not found." };
    }

    if (user.password !== password) {
      return { error: "Invalid password" };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const jwt = await new jose.SignJWT({})
      .setProtectedHeader({ alg })
      .setExpirationTime("72h")
      .setSubject(user.id.toString())
      .sign(secret);

    (
      await // Set the cookie with the JWT
      cookies()
    ).set("Kamanga-Authorization", jwt, {
      httpOnly: true, // Set to true for security
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 3, // Cookie expiration (3 days in seconds)
      sameSite: "strict", // Adjust according to your needs
      path: "/", // Adjust path as needed
    });

    await logSystemAction(
      "login",
      `User '${username}' logged in successfully.`,
      user.id
    );

    return { success: "Login success! Redirecting to dashboard..." };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
};

export const signOut = async (userId?: string) => {
  (await cookies()).set("Kamanga-Authorization", "", { maxAge: 0, path: "/" });

  await logSystemAction(
    "logout",
    `User '${userId ?? "unknown"}' logged out.`,
    userId
  );
};

export const getAllHouseholds = async () => {
  try {
    const response = await db.houseHold.findMany();
    return { success: true, data: response };
  } catch (error) {
    console.error("Error fetching households:", error);
    return { error: "Failed to fetch households" };
  }
};

export const createNewHousehold = async (householdNumber: string) => {
  const { userId } = await useUser();
  try {
    const existingHousehold = await db.houseHold.findUnique({
      where: { householdNumber },
    });

    if (existingHousehold) {
      return { error: "Household number already exists" };
    }

    const newHousehold = await db.houseHold.create({
      data: { householdNumber },
    });

    await logSystemAction(
      "create_household",
      `New household created with number '${householdNumber}'.`,
      userId
    );

    return { success: true, data: newHousehold };
  } catch (error) {
    console.error("Error creating household:", error);
    return { error: "Failed to create household" };
  }
};

export const createProfile = async (data: ProfileFormData) => {
  const { userId } = await useUser();
  try {
    // ✅ Validate input
    const validated = ProfileValidators.parse(data);

    // ✅ Check or create household
    let household = await db.houseHold.findUnique({
      where: { householdNumber: validated.householdNumber },
    });

    if (!household) {
      household = await db.houseHold.create({
        data: {
          householdNumber: validated.householdNumber,
          location: validated.location,
          monthlyIncome: validated.monthlyIncome,
        },
      });

      await db.systemLogs.create({
        data: {
          action: "create_household_auto",
          details: `Automatically created household '${validated.householdNumber}' for profile '${validated.firstName} ${validated.lastName}'.`,
          userId: userId ?? null,
        },
      });
    } else {
      // Update household info if changed
      await db.houseHold.update({
        where: { id: household.id },
        data: {
          location: validated.location,
          monthlyIncome: validated.monthlyIncome,
        },
      });
    }

    // ✅ Create profile
    const profile = await db.profile.create({
      data: {
        householdId: household.id,
        areYou4ps: validated.areYou4ps,
        areYouIps: validated.areYouIps,
        areYouPwd: validated.areYouPwd,
        firstName: validated.firstName,
        middleName: validated.middleName,
        lastName: validated.lastName,
        relationship: validated.relationship,
        birthDate: validated.birthDate,
        age: validated.age,
        sex: validated.sex,
        odkMember: validated.odkMember,
        occupation: validated.occupation,
        educationalAttainment: validated.educationalAttainment,
        religion: validated.religion,
        ethnicGroup: validated.ethnicGroup,
        philhealthNumber: validated.philhealthNumber,
        emergencyContactName: validated.emergencyContactName,
        emergencyContactNumber: validated.emergencyContactNumber,
        areYouPregnant: validated.areYouPregnant,
        lastMenstrualPeriod: validated.lastMenstrualPeriod,
        expectedDeliveryDate: validated.expectedDeliveryDate,
        doYouBreastfeed: validated.doYouBreastfeed,
        immunizedChildren: validated.immunizedChildren,
        marriedCouple: validated.marriedCouple,
        sanitizedToilet: validated.sanitizedToilet,
        constructedDateToilet: validated.constructedDateToilet,
        presumptiveTubercolosis: validated.presumptiveTubercolosis,
        broughtToFacility: validated.broughtToFacility,
        dwellingType: validated.dwellingType,
        waterSource: validated.waterSource,
        vegetables: validated.vegetables,
        animals: validated.animals,
        bingeDrinker: validated.bingeDrinker,
        smoker: validated.smoker,
        garbageDisposal: validated.garbageDisposal,
        hypertension: validated.hypertension,
        diabetes: validated.diabetes,
        bothSickness: validated.bothSickness,
        oscaNumber: validated.oscaNumber || null,
        pwdInformation: validated.pwdInformation,
        facilityBasedDelivery: {
          create: validated.facilityBasedDeliveries?.map((item) => ({
            label: item.label,
            facilityMale: item.facilityMale,
            facilityFemale: item.facilityFemale,
            nonFacilityMale: item.nonFacilityMale,
            nonFacilityFemale: item.nonFacilityFemale,
          })),
        },
        babyData: {
          create: validated.babyData?.map((item) => ({
            height: item.height,
            weight: item.weight,
            muac: item.muac,
          })),
        },
      },
    });

    await logSystemAction(
      "create_profile",
      `Profile '${validated.firstName} ${validated.lastName}' created under household '${validated.householdNumber}'.`,
      userId
    );

    return { success: true, data: profile };
  } catch (error: any) {
    console.error("Error creating profile:", error);
    return { error: error.message || "Failed to create profile" };
  }
};

export const updateProfile = async (data: ProfileFormData, id: string) => {
  const { userId, user } = await useUser();

  // Check if user is ADMIN
  if (!user || user.role !== Role.ADMIN) {
    return { error: "Unauthorized: Only administrators can update profiles" };
  }

  try {
    const validated = ProfileValidators.parse(data);

    // ✅ Update household
    const household = await db.houseHold.upsert({
      where: { householdNumber: validated.householdNumber },
      update: {
        location: validated.location,
        monthlyIncome: validated.monthlyIncome,
      },
      create: {
        householdNumber: validated.householdNumber,
        location: validated.location,
        monthlyIncome: validated.monthlyIncome,
      },
    });

    // ✅ Update profile
    const profile = await db.profile.update({
      where: { id },
      data: {
        householdId: household.id,
        areYou4ps: validated.areYou4ps,
        areYouIps: validated.areYouIps,
        areYouPwd: validated.areYouPwd,
        firstName: validated.firstName,
        middleName: validated.middleName,
        lastName: validated.lastName,
        relationship: validated.relationship,
        birthDate: validated.birthDate,
        age: validated.age,
        sex: validated.sex,
        odkMember: validated.odkMember,
        occupation: validated.occupation,
        educationalAttainment: validated.educationalAttainment,
        religion: validated.religion,
        ethnicGroup: validated.ethnicGroup,
        philhealthNumber: validated.philhealthNumber,
        emergencyContactName: validated.emergencyContactName,
        emergencyContactNumber: validated.emergencyContactNumber,
        areYouPregnant: validated.areYouPregnant,
        lastMenstrualPeriod: validated.lastMenstrualPeriod,
        expectedDeliveryDate: validated.expectedDeliveryDate,
        doYouBreastfeed: validated.doYouBreastfeed,
        immunizedChildren: validated.immunizedChildren,
        marriedCouple: validated.marriedCouple,
        sanitizedToilet: validated.sanitizedToilet,
        constructedDateToilet: validated.constructedDateToilet,
        presumptiveTubercolosis: validated.presumptiveTubercolosis,
        broughtToFacility: validated.broughtToFacility,
        dwellingType: validated.dwellingType,
        waterSource: validated.waterSource,
        vegetables: validated.vegetables,
        animals: validated.animals,
        bingeDrinker: validated.bingeDrinker,
        smoker: validated.smoker,
        garbageDisposal: validated.garbageDisposal,
        hypertension: validated.hypertension,
        diabetes: validated.diabetes,
        bothSickness: validated.bothSickness,
        oscaNumber: validated.oscaNumber || null,
        pwdInformation: validated.pwdInformation,
      },
    });

    // ✅ Replace related data
    await db.facilityBasedDelivery.deleteMany({ where: { profileId: id } });
    await db.babyData.deleteMany({ where: { profileId: id } });

    // Only create if data exists
    if (validated.facilityBasedDeliveries?.length) {
      await db.facilityBasedDelivery.createMany({
        data: validated.facilityBasedDeliveries.map((item) => ({
          profileId: id,
          label: item.label,
          facilityMale: item.facilityMale,
          facilityFemale: item.facilityFemale,
          nonFacilityMale: item.nonFacilityMale,
          nonFacilityFemale: item.nonFacilityFemale,
        })),
      });
    }

    if (validated.babyData?.length) {
      await db.babyData.createMany({
        data: validated.babyData.map((item) => ({
          profileId: id,
          height: item.height,
          weight: item.weight,
          muac: item.muac,
        })),
      });
    }

    await logSystemAction(
      "update_profile",
      `Profile '${validated.firstName} ${validated.lastName}' (ID: ${id}) updated successfully.`,
      userId
    );

    return { success: true, data: profile };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { error: error.message || "Failed to update profile" };
  }
};

export const deleteProfile = async (id: string) => {
  const { userId, user } = await useUser();

  // Check if user is ADMIN
  if (!user || user.role !== Role.ADMIN) {
    return { error: "Unauthorized: Only administrators can delete profiles" };
  }

  try {
    // Check if profile exists
    const profile = await db.profile.findUnique({
      where: { id },
      include: {
        babyData: true,
        facilityBasedDelivery: true,
      },
    });

    if (!profile) {
      return { error: "Profile not found" };
    }

    // Delete related records first
    await db.babyData.deleteMany({ where: { profileId: id } });
    await db.facilityBasedDelivery.deleteMany({ where: { profileId: id } });

    // Delete profile
    await db.profile.delete({ where: { id } });

    await logSystemAction(
      "delete_profile",
      `Profile '${profile.firstName} ${profile.lastName}' (ID: ${id}) deleted.`,
      userId
    );

    return { success: true, message: "Profile deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting profile:", error);
    return { error: error.message || "Failed to delete profile" };
  }
};

export const createNote = async (
  values: z.infer<typeof noteSchema>,
  userId: string
) => {
  try {
    // Validate input with Zod
    const parsedValues = noteSchema.parse(values);

    // Determine the next order for this user's notes
    const lastNote = await db.notes.findFirst({
      where: { userId },
      orderBy: { order: "desc" },
    });
    const nextOrder = lastNote ? lastNote.order + 1 : 1;

    // Create the note in the database
    const note = await db.notes.create({
      data: {
        template: parsedValues.template,
        content: parsedValues.content,
        tags: parsedValues.tags,
        color: parsedValues.color,
        order: nextOrder,
        userId,
      },
    });

    await logSystemAction(
      "create_note",
      `Note '${parsedValues.template}' created by user '${userId}'.`,
      userId
    );

    return { success: "Note created successfully", note };
  } catch (error) {
    console.error("Failed to create note:", error);
    return { error: "Could not create note. Please try again." };
  }
};

export const updateNote = async (
  noteId: string,
  values: z.infer<typeof noteSchema>,
  userId: string
) => {
  const { user } = await useUser();

  // Check if user is ADMIN
  if (!user || user.role !== Role.ADMIN) {
    return { error: "Unauthorized: Only administrators can update notes" };
  }

  try {
    // Validate input with Zod
    const parsedValues = noteSchema.parse(values);

    // Find the note to ensure it belongs to the user
    const existingNote = await db.notes.findFirst({
      where: { id: noteId, userId },
    });

    if (!existingNote) {
      return {
        error: "Note not found or you do not have permission to update it.",
      };
    }

    // Update the note
    const updatedNote = await db.notes.update({
      where: { id: noteId },
      data: {
        template: parsedValues.template,
        content: parsedValues.content,
        tags: parsedValues.tags,
        color: parsedValues.color,
      },
    });

    return { success: "Note updated successfully", note: updatedNote };
  } catch (error) {
    console.error("Failed to update note:", error);
    return { error: "Could not update note. Please try again." };
  }
};

export const updateNoteColor = async (noteId: string, color: string) => {
  const { user } = await useUser();

  // Check if user is ADMIN
  if (!user || user.role !== Role.ADMIN) {
    return { success: false, error: "Unauthorized: Only administrators can update notes" };
  }

  try {
    await db.notes.update({
      where: { id: noteId },
      data: { color },
    });

    // Return success for client feedback
    return { success: true };
  } catch (error) {
    console.error("Failed to update note color:", error);
    return { success: false, error: "Database update failed" };
  }
};

export const updateNotePin = async (noteId: string, isPinned: boolean) => {
  const { user } = await useUser();

  // Check if user is ADMIN
  if (!user || user.role !== Role.ADMIN) {
    return { success: false, error: "Unauthorized: Only administrators can update notes" };
  }

  try {
    await db.notes.update({
      where: { id: noteId },
      data: { isPinned },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating pin:", error);
    return { success: false };
  }
};

export const updateNoteOrder = async (noteId: string, newOrder: number) => {
  try {
    await db.notes.update({
      where: { id: noteId },
      data: { order: newOrder },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false };
  }
};

export const deleteNote = async (noteId: string) => {
  const { user } = await useUser();

  // Check if user is ADMIN
  if (!user || user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Only administrators can delete notes");
  }

  try {
    await db.notes.delete({
      where: { id: noteId },
    });
    return { success: true };
  } catch (error) {
    console.error("Delete note failed:", error);
    throw new Error("Failed to delete note.");
  }
};

export const createEmployee = async (
  values: z.infer<typeof employeeSchema>
) => {
  const { userId } = await useUser();
  try {
    // Validate input with Zod
    const parsedValues = employeeSchema.parse(values);

    // Check if there a username exist
    const existingEmployee = await db.user.findFirst({
      where: { username: parsedValues.username },
    });

    if (existingEmployee) {
      return { error: "Username already exist" };
    }

    // Create the employee in the database
    const employee = await db.user.create({
      data: {
        ...parsedValues,
      },
    });

    await logSystemAction(
      "create_employee",
      `Employee '${employee.name}' created successfully.`,
      userId
    );

    return { success: "Employee created successfully", employee };
  } catch (error) {
    console.error("Failed to create employee:", error);
    return { error: "Could not create employee. Please try again." };
  }
};

export const updateEmployee = async (
  id: string,
  values: z.infer<typeof employeeSchema>
) => {
  const { userId, user } = await useUser();

  // Check if user is ADMIN
  if (!user || user.role !== Role.ADMIN) {
    return { error: "Unauthorized: Only administrators can update employees" };
  }

  try {
    // Validate input with Zod
    const parsedValues = employeeSchema.parse(values);

    // Check if the employee exists
    const existingEmployee = await db.user.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return { error: "Employee not found." };
    }

    // Check if the username is being updated and already exists in another record
    if (parsedValues.username) {
      const usernameExists = await db.user.findFirst({
        where: {
          username: parsedValues.username,
          NOT: { id },
        },
      });

      if (usernameExists) {
        return { error: "Username already exists for another employee." };
      }
    }

    // Update employee
    const updatedEmployee = await db.user.update({
      where: { id },
      data: {
        ...parsedValues,
      },
    });

    await logSystemAction(
      "update_employee",
      `Employee '${updatedEmployee.name}' (ID: ${id}) updated successfully.`,
      userId
    );

    return {
      success: "Employee updated successfully",
      employee: updatedEmployee,
    };
  } catch (error) {
    console.error("Failed to update employee:", error);
    return { error: "Could not update employee. Please try again." };
  }
};

export const deleteEmployee = async (id: string) => {
  const { userId, user } = await useUser();

  // Check if user is ADMIN
  if (!user || user.role !== Role.ADMIN) {
    return { error: "Unauthorized: Only administrators can delete employees" };
  }

  try {
    // Check if the employee exists
    const existingEmployee = await db.user.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return { error: "Employee not found." };
    }

    // Delete the employee
    await db.user.delete({
      where: { id },
    });

    await logSystemAction(
      "delete_employee",
      `Employee '${existingEmployee.name}' (ID: ${id}) deleted.`,
      userId
    );

    return { success: "Employee deleted successfully." };
  } catch (error) {
    console.error("Failed to delete employee:", error);
    return { error: "Could not delete employee. Please try again." };
  }
};

export const saveEvent = async (data: {
  title: string;
  description: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  location?: string;
  color?: string;
}) => {
  try {
    // Get the authenticated user (adjust based on your auth setup)
    const { userId } = await useUser();

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized. Please log in.",
      };
    }

    // Validate required fields
    if (!data.title || !data.start || !data.end) {
      return {
        success: false,
        error: "Title, start date, and end date are required.",
      };
    }

    // Validate dates
    if (data.end < data.start) {
      return {
        success: false,
        error: "End date cannot be before start date.",
      };
    }

    const event = await db.events.create({
      data: {
        title: data.title,
        description: data.description,
        start: data.start,
        end: data.end,
        allDay: data.allDay,
        location: data.location,
        color: data.color,
      },
    });

    await logSystemAction(
      "create_event",
      `Event '${event.title}' created for date '${event.start}'.`,
      userId
    );

    return {
      success: true,
      data: event,
      message: "Event created successfully",
    };
  } catch (error) {
    console.error("Error saving event:", error);
    return {
      success: false,
      error: "Failed to save event. Please try again.",
    };
  }
};

export const getEvents = async () => {
  const events = await db.events.findMany({});
  return events;
};

export const deleteEvent = async (eventId: string) => {
  const { userId, user } = await useUser();

  // Check if user is ADMIN
  if (!user || user.role !== Role.ADMIN) {
    return {
      success: false,
      error: "Unauthorized: Only administrators can delete events",
    };
  }

  try {
    if (!eventId) {
      return {
        success: false,
        error: "Missing event ID.",
      };
    }

    // Check if event exists
    const existing = await db.events.findUnique({
      where: { id: eventId },
    });

    if (!existing) {
      return {
        success: false,
        error: "Event not found.",
      };
    }

    // Delete the event
    await db.events.delete({
      where: { id: eventId },
    });

    await logSystemAction(
      "delete_event",
      `Event '${existing.title}' (ID: ${existing.id}) deleted.`,
      userId
    );

    return {
      success: true,
      message: "Event deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      error: "Failed to delete event. Please try again.",
    };
  }
};

export const createProgram = async (
  values: z.infer<typeof healthProgramSchema>
) => {
  const { userId } = await useUser();
  try {
    // Validate input with Zod
    const parsedValues = healthProgramSchema.parse(values);

    // ✅ Create the health program along with its sections
    const healthProgram = await db.healthProgram.create({
      data: {
        title: parsedValues.title,
        description: parsedValues.description,
        instructor: parsedValues.instructor,
        instructorDescription: parsedValues.instructorDescription,
        tags: parsedValues.tags,
        thumbnailUrl: parsedValues.thumbnailUrl,
        viewsCount: 0, // default value
        sections: {
          create: parsedValues.sections.map((section) => ({
            title: section.title,
            description: section.description || null,
            videoUrl: section.videoUrl,
            totalDuration: section.totalDuration,
            order: section.order,
          })),
        },
      },
    });

    await logSystemAction(
      "create_program",
      `Program '${healthProgram.title}' created successfully.`,
      userId
    );

    return { success: "Program created successfully", healthProgram };
  } catch (error) {
    console.error("Failed to create program:", error);
    return { error: "Could not create program. Please try again." };
  }
};

export const updateProgram = async (
  id: string,
  values: z.infer<typeof healthProgramSchema>
) => {
  const { userId, user } = await useUser();

  // Check if user is ADMIN
  if (!user || user.role !== Role.ADMIN) {
    return { error: "Unauthorized: Only administrators can update programs" };
  }

  try {
    // ✅ Validate input with Zod
    const parsedValues = healthProgramSchema.parse(values);

    // ✅ Ensure program exists
    const existing = await db.healthProgram.findUnique({
      where: { id },
    });

    if (!existing) {
      return { error: "Program not found." };
    }

    // ✅ Remove all old sections first (simpler, ensures no leftovers)
    await db.programSection.deleteMany({
      where: { healthProgramId: id },
    });

    // ✅ Update the main program
    const updatedProgram = await db.healthProgram.update({
      where: { id },
      data: {
        title: parsedValues.title,
        description: parsedValues.description,
        instructor: parsedValues.instructor,
        instructorDescription: parsedValues.instructorDescription,
        tags: parsedValues.tags,
        thumbnailUrl: parsedValues.thumbnailUrl,
        sections: {
          create: parsedValues.sections.map((section) => ({
            title: section.title,
            description: section.description || null,
            videoUrl: section.videoUrl,
            totalDuration: section.totalDuration,
            order: section.order,
          })),
        },
      },
      include: {
        sections: true,
      },
    });

    await logSystemAction(
      "update_program",
      `Program '${updatedProgram.title}' (ID: ${id}) updated successfully.`,
      userId
    );

    return { success: "Program updated successfully!", updatedProgram };
  } catch (error) {
    console.error("Failed to update program:", error);
    return { error: "Could not update program. Please try again." };
  }
};

export const deleteProgram = async (programId: string) => {
  const { userId, user } = await useUser();

  // Check if user is ADMIN
  if (!user || user.role !== Role.ADMIN) {
    return { error: "Unauthorized: Only administrators can delete programs" };
  }

  try {
    // Delete related sections first
    await db.programSection.deleteMany({
      where: { healthProgramId: programId },
    });

    // Then delete the program
    await db.healthProgram.delete({
      where: { id: programId },
    });

    await logSystemAction(
      "delete_program",
      `Program (ID: ${programId}) deleted.`,
      userId
    );

    return { success: true };
  } catch (error) {
    console.error("Delete program failed:", error);
    throw new Error("Failed to delete program.");
  }
};

export async function createFileNode(data: {
  name: string;
  type: "file" | "folder";
  icon: string;
  date?: Date;
  size: string;
  parentId?: string;
}) {
  const { user } = await useUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  const fileNode = await db.fileNode.create({
    data: {
      ...data,
      ownerName: user.name,
      ownerAvatar: user.image || "",
      date: data.date || new Date(),
    },
  });

  await logSystemAction(
    "create_file_node",
    `${data.type === "folder" ? "Folder" : "File"} '${data.name}' created by '${
      user.name
    }'.`,
    user.id
  );

  return fileNode;
}

export async function getFilesByParent(parentId?: string) {
  const files = await db.fileNode.findMany({
    where: { parentId: parentId || null },
    include: { children: true }, // include nested children if needed
  });
  return files;
}

export async function getFileById(id: string) {
  return await db.fileNode.findUnique({
    where: { id },
    include: { children: true },
  });
}

export async function updateFileNode(
  id: string,
  data: Partial<{
    name: string;
    type: "file" | "folder";
    icon: string;
    size: string;
    ownerName: string;
    ownerAvatar: string;
    parentId?: string;
  }>
) {
  return await db.fileNode.update({
    where: { id },
    data,
  });
}

export async function deleteFileNode(id: string) {
  const { user } = await useUser();

  // Check if user is ADMIN
  if (!user || user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Only administrators can delete files");
  }

  // Delete children first if folder
  const fileNode = await db.fileNode.findUnique({
    where: { id },
    include: { children: true },
  });

  if (fileNode?.children?.length) {
    for (const child of fileNode.children) {
      await deleteFileNode(child.id);
    }
  }

  // Delete the node itself
  return await db.fileNode.delete({ where: { id } });
}

async function fetchFilesRecursive(
  parentId: string | null = null
): Promise<FileNodeWithChildren[]> {
  const nodes = await db.fileNode.findMany({
    where: { parentId },
    select: {
      id: true,
      name: true,
      type: true,
      icon: true,
      date: true,
      size: true,
      ownerName: true,
      ownerAvatar: true,
      parentId: true,
    },
    orderBy: { name: "asc" },
  });

  const result: FileNodeWithChildren[] = [];

  for (const node of nodes) {
    let children: FileNodeWithChildren[] = [];
    if (node.type === "folder") {
      children = await fetchFilesRecursive(node.id);
    }

    result.push({
      ...node,
      children,
    });
  }

  console.log(nodes.map((n) => ({ name: n.name, size: n.size })));

  return result;
}

export async function getAllFiles() {
  try {
    // Start from root level (no parent)
    const files = await fetchFilesRecursive(null);
    return files;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw new Error("Failed to fetch files");
  }
}

export async function getDiseaseDemographics() {
  const profiles = await db.profile.findMany({
    include: { household: true },
  });

  const map = new Map<
    string,
    { hypertension: number; diabetes: number; tubercolosis: number }
  >();

  for (const p of profiles) {
    const sitio = p.household?.location || "Unknown";
    if (!map.has(sitio)) {
      map.set(sitio, { hypertension: 0, diabetes: 0, tubercolosis: 0 });
    }

    const entry = map.get(sitio)!;

    if (p.hypertension && p.hypertension.toLowerCase() === "yes")
      entry.hypertension++;
    if (p.diabetes && p.diabetes.toLowerCase() === "yes") entry.diabetes++;
    if (p.presumptiveTubercolosis) entry.tubercolosis++;
  }

  const chartData = Array.from(map.entries()).map(([sitio, data]) => ({
    sitio,
    ...data,
  }));

  return chartData;
}

export async function updateProfileEmployee(userId: string, data: FormData) {
  const name = data.get("name")?.toString();
  const username = data.get("username")?.toString();
  const image = data.get("image")?.toString() || null;

  try {
    await db.user.update({
      where: { id: userId },
      data: { name, username, image },
    });

    return { success: true, message: "Profile updated successfully!" };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Error updating profile" };
  }
}

export const getAllPrograms = async () => {
  const programs = await db.healthProgram.findMany({
    include: {
      sections: true,
    },
  });

  return programs;
};
