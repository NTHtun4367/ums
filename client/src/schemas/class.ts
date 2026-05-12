// @/schemas/class.ts
import { z } from "zod";

export const classFormSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  academicYearId: z.string().min(1, "Academic year is required"),
  departmentId: z.string().min(1, "Department is required"),
  classTeacherId: z.string().optional(),
  semester: z.number().min(1, "Semester is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
});

export type ClassFormValues = z.infer<typeof classFormSchema>;
