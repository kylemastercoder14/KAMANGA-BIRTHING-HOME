import { TemplateType } from "@prisma/client";
import { z } from "zod";

export const noteSchema = z.object({
  template: z.enum(TemplateType),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).optional(),
  color: z.string().min(1, "Color is required"),
});
