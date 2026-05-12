import { z } from "zod";

const academicYearFormat = /^\d{4}-\d{4}$/;

export const academicYearFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Academic Year name is required")
      .regex(
        academicYearFormat,
        "Invalid format. Use YYYY-YYYY (e.g., 2025-2026)",
      ),
    startDate: z.date({
      message: "Start date is required",
    }),
    endDate: z.date({
      message: "End date is required",
    }),
    isCurrent: z.boolean(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type AcademicYearFormValues = z.infer<typeof academicYearFormSchema>;
