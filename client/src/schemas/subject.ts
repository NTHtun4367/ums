import { z } from "zod";

export const subjectFormSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 chars"),
  code: z
    .string({ message: "Code is required" })
    .min(2, "Code is required")
    .toUpperCase(),
  teacher: z.array(z.string()).optional(),
  isActive: z.boolean(),
});

export type SubjectFormValues = z.infer<typeof subjectFormSchema>;
