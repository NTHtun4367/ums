import * as z from "zod";

export const userFormSchema = z
  .object({
    name: z.string().min(2, "Full name is required"),
    email: z.email("Invalid email address"),
    phone: z.string().min(7, "Phone number is required"),
    gender: z.enum(["male", "female", "other"]),
    role: z.enum(["admin", "hod", "teacher", "student"]),
    departmentId: z.string().optional(),
    teacherStatus: z
      .enum(["professor", "assistant_professor", "lecturer", "tutor"])
      .optional(),
    classId: z.string().optional(),
    rollNo: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // PASSWORD VALIDATION
    if (data.password && data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must be at least 6 characters",
      });
    }

    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }

    // DEPARTMENT REQUIRED EXCEPT ADMIN
    if (data.role !== "admin" && !data.departmentId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["departmentId"],
        message: "Department is required",
      });
    }

    // TEACHER VALIDATION
    if (
      (data.role === "teacher" || data.role === "hod") &&
      !data.teacherStatus
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["teacherStatus"],
        message: "Teacher status is required",
      });
    }

    // STUDENT VALIDATION
    if (data.role === "student") {
      if (!data.classId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["classId"],
          message: "Class is required",
        });
      }

      if (!data.rollNo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rollNo"],
          message: "Roll number is required",
        });
      }
    }
  });

export type UserFormValues = z.infer<typeof userFormSchema>;
