"use server";

import db from "@/lib/db";

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
