import * as z from "zod";

export const userFormSchema = z
  .object({
    name: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(5, "Phone number is required"),
    gender: z.enum(["male", "female", "other"]),
    role: z.string().optional(),
    departmentId: z.string().min(1, "Department selection is required"),
    // Teacher specific
    teacherStatus: z.string().optional(),
    isHod: z.boolean(),
    subjectIds: z.array(z.string()).optional(),
    // Student specific
    classId: z.string().optional(),
    rollNo: z.string().optional(),
    // Security
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    /**
     * 1. Password Length Validation
     * We only validate length if a password was actually entered.
     * This allows 'Update' mode to leave it empty.
     */
    if (data.password && data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 6 characters",
        path: ["password"],
      });
    }

    /**
     * 2. Password Confirmation Validation
     * Validates that both fields match if either is touched.
     */
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    }
  });

export type UserFormValues = z.infer<typeof userFormSchema>;
