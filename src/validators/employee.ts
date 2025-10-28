import { Role } from "@prisma/client";
import { z } from "zod";

export const employeeSchema = z.object({
  role: z.enum(Role),
  username: z.string().min(1, "Username is required"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(1, "Password is required"),
  image: z.string().optional(),
  biodata: z.string().optional(),
});
