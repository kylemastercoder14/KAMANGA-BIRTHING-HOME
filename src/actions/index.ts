"use server";

import db from "@/lib/db";
import z from "zod";
import { noteSchema } from "@/validators/note";

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

    return { success: true, data: newHousehold };
  } catch (error) {
    console.error("Error creating household:", error);
    return { error: "Failed to create household" };
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
