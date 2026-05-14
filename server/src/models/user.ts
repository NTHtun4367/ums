import { Document, model, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

export enum UserRole {
  ADMIN = "admin",
  HOD = "hod",
  TEACHER = "teacher",
  STUDENT = "student",
}

// Added an enum for Teacher Status to ensure data consistency
export enum TeacherStatus {
  PROFESSOR = "professor",
  ASSISTANT_PROFESSOR = "assistant_professor",
  LECTURER = "lecturer",
  TUTOR = "tutor",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  phone: string;
  gender: "male" | "female" | "other";
  departmentId?: Types.ObjectId; // For HODs/Teachers/Students

  // Teacher Specific (Newly Added)
  teacherStatus?: TeacherStatus;

  // Student Specific
  classId?: Types.ObjectId;
  rollNo?: string;
  admissionDate?: Date;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    isActive: { type: Boolean, default: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department" },

    // Teacher Specific Field
    teacherStatus: {
      type: String,
      enum: Object.values(TeacherStatus),
    },

    // Student Specific Fields
    classId: { type: Schema.Types.ObjectId, ref: "Class" },
    rollNo: { type: String },
    admissionDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = model<IUser>("User", userSchema);
