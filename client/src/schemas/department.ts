// @/schemas/department.ts
import { z } from "zod";

export const departmentFormSchema = z.object({
  name: z.string().min(1, "Department name is required").trim(),
  code: z
    .string()
    .min(1, "Code must be at least 1 characters")
    .max(10, "Code is too long")
    .toUpperCase(),
  description: z.string().optional(),
  isAcademic: z.boolean(),
  headId: z.string().optional(), // Handled as string ID for the form
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;
