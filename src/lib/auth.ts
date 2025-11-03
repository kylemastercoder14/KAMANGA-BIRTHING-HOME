import { useUser } from "@/hooks/use-user";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

/**
 * Check if the current user is an ADMIN
 * Returns the user object if ADMIN, throws error or redirects if STAFF
 */
export async function requireAdmin() {
  const { user, error } = await useUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  if (user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Admin access required");
  }

  return user;
}

/**
 * Get the current user and their role
 * Returns user object or null
 */
export async function getCurrentUser() {
  const { user, error } = await useUser();
  if (error || !user) {
    return null;
  }
  return user;
}

/**
 * Check if the current user is an ADMIN
 * Returns boolean
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === Role.ADMIN;
}

/**
 * Check if the current user is STAFF
 * Returns boolean
 */
export async function isStaff(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === Role.STAFF;
}

