import { Document, model, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

export enum UserRole {
  ADMIN = "admin",
  HOD = "hod",
  TEACHER = "teacher",
  STUDENT = "student",
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
