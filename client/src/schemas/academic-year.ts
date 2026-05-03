import { z } from "zod";

// Regular Expression for YYYY-YYYY format
const academicYearFormat = /^\d{4}-\d{4}$/;

export const academicYearFormSchema = z.object({
  name: z
    .string()
    .min(1, "Academic Year name is required")
    .regex(
      academicYearFormat,
      "Invalid format. Use YYYY-YYYY (e.g., 2025-2026)",
    ),
  fromYear: z.date({ message: "Start date is required" }),
  toYear: z.date({ message: "End date is required" }),
  isCurrent: z.boolean(),
});

export type AcademicYearFormValues = z.infer<typeof academicYearFormSchema>;
