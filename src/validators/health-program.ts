import { z } from "zod";

export const programSectionSchema = z.object({
  title: z.string().min(1, "Section title is required"),
  description: z.string().optional(),
  videoUrl: z.string().min(1, "Video is required"),
  totalDuration: z
    .number()
    .int()
    .positive("Duration must be a positive number"),
  order: z.number().int().positive("Order must be a positive number"),
});

export const healthProgramSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  instructor: z.string().min(1, "Instructor name is required"),
  instructorDescription: z
    .string()
    .min(1, "Instructor description is required"),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .nonempty("At least one tag is required"),
  thumbnailUrl: z.string().min(1, "Thumbnail is required"),
  sections: z.array(programSectionSchema),
});
