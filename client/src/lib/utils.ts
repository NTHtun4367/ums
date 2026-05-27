import type { User, UserRole } from "@/types/type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// helpers/user.helper.ts

export const prepareUserPayload = (
  data: any,
): Partial<User> & { password?: string } => {
  return {
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role as UserRole,

    classId: data.classId ? data.classId : undefined,

    teacherSubjects: data.teacherSubjects ? data.teacherSubjects : [],
  };
};
