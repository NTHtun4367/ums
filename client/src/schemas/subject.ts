// @/schemas/subject.ts
import { z } from "zod";

export const subjectFormSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  code: z.string().min(1, "Subject code is required"),
  departmentId: z.string().min(1, "Department is required"),
  semester: z.number().min(1, "Min semester is 1").max(8, "Max semester is 8"),
});

export type SubjectFormValues = z.infer<typeof subjectFormSchema>;
