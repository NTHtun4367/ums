import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user";
import { generateToken } from "../utils/generateToken";

// @desc Register new user
// @route POST /api/users/register
// @access Private (Admin & Teacher only)
export const register = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    role,
    isActive,
    studentClass,
    teacherSubject,
  } = req.body;

  // check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists!");
  }

  // create user
  const newUser = await User.create({
    name,
    email,
    password,
    role,
    isActive,
    studentClass,
    teacherSubject,
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: newUser.isActive,
      studentClass: newUser.studentClass,
      teacherSubject: newUser.teacherSubject,
      message: "User registered successfully!",
    });
  } else {
    throw new Error("Invalid user data!");
  }
});

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
    // generate token
    generateToken(res, user._id.toString());
    res.status(200).json(user);
  } else {
    res.status(401).json({ message: "Invalid email or password!" });
  }
});
