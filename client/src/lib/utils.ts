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
    // 🔴 အရေးကြီးဆုံးအပိုင်း: string ကို UserRole အဖြစ်သတ်မှတ်ခြင်း
    role: data.role as UserRole,

    // Student ဖြစ်ရင် Class ID ကို ထည့်ပေးခြင်း
    studentClass: data.studentClass ? data.studentClass : undefined,

    // Teacher ဖြစ်ရင် Subject IDs (Array) ကို ထည့်ပေးခြင်း
    teacherSubjects: data.teacherSubjects ? data.teacherSubjects : [],
  };
};
