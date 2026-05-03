import { z } from "zod";

export const classFormSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  capacity: z.coerce
    .number()
    .min(1, "Capacity must be at least 1")
    .positive("Capacity must be positive"),
  academicYear: z.string().min(1, "Academic year is required"),
  classTeacher: z.string().optional().nullable(),
  subjectIds: z.array(z.string()).min(1, "At least one subject is required"),
});

export type ClassFormValues = z.infer<typeof classFormSchema>;
