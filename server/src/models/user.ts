import { Document, model, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

export enum UserRole {
  ADMIN = "admin",
  HOD = "hod",
  TEACHER = "teacher",
  STUDENT = "student",
}

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

  departmentId?: Types.ObjectId;

  teacherStatus?: TeacherStatus;

  classId?: Types.ObjectId;
  rollNo?: string;
  admissionDate?: Date;

  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{7,15}$/,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: function (this: IUser) {
        return this.role !== UserRole.ADMIN;
      },
    },

    teacherStatus: {
      type: String,
      enum: Object.values(TeacherStatus),
      required: function (this: IUser) {
        return this.role === UserRole.TEACHER || this.role === UserRole.HOD;
      },
    },

    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: function (this: IUser) {
        return this.role === UserRole.STUDENT;
      },
    },

    rollNo: {
      type: String,
      trim: true,
      required: function (this: IUser) {
        return this.role === UserRole.STUDENT;
      },
    },

    admissionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ role: 1 });
userSchema.index({ departmentId: 1 });
userSchema.index({ classId: 1 });

export const User = model<IUser>("User", userSchema);
