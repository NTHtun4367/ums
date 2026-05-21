import { Types } from "mongoose";

export const isValidObjectId = (value: string) => {
  if (!Types.ObjectId.isValid(value)) {
    throw new Error("Invalid unique identifier format");
  }
  return true;
};

export const isValidTime = (value: string) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(value)) {
    throw new Error("Time must be in 24-hour format (HH:MM)");
  }
  return true;
};
