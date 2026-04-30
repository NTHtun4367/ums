import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user";
import { generateToken } from "../utils/generateToken";
import { AuthRequest } from "../middlewares/auth";
import { logActivity } from "../utils/activitieslog";

// @desc Register new user
// @route POST /api/users/register
// @access Private (Admin & Teacher only)
export const register = asyncHandler(
  async (req: AuthRequest, res: Response) => {
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
      if (req.user) {
        await logActivity({
          user: req.user._id.toString(),
          action: "Registered User",
          details: `Registered user with this email: ${newUser.email}`,
        });
      }
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
  },
);

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

// @desc Update user (Admin)
// @route PATCH /api/users/update/:id
// @access Private (Admin only)
export const updateUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new Error("User not found!");
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.isActive = req.body.isActive || user.isActive;
    user.studentClass = req.body.studentClass || user.studentClass;
    user.teacherSubject = req.body.teacherSubject || user.teacherSubject;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    if (req.user) {
      await logActivity({
        user: req.user._id.toString(),
        action: "Updated User",
        details: `Updated user with this email: ${updatedUser.email}`,
      });
    }

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      studentClass: updatedUser.studentClass,
      teacherSubject: updatedUser.teacherSubject,
      message: "User updated successfully!",
    });
  },
);

// @desc Get all users (With Pagination & Filtering)
// @route GET /api/users
// @access Private (Admin only)
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const role = req.query.role;
  const search = req.query.search;

  const filters: any = {};

  if (role && role !== "all" && role !== "") {
    filters.role = role;
  }

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // fetch users with pagination & filtering
  const [total, users] = await Promise.all([
    User.countDocuments(),
    User.find(filters)
      .select("-password")
      .populate("studentClass", "_id name section")
      .populate("teacherSubjects", "_id name code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  res.status(200).json({
    users,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      total,
      limit,
    },
  });
});

// @desc Delete user (Admin)
// @route DELETE /api/users/delete/:id
// @access Private (Admin only)
export const deleteUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new Error("User not found!");
    }

    await user.deleteOne();

    if (req.user) {
      await logActivity({
        user: req.user._id.toString(),
        action: "Deleted User",
        details: `Deleted user with this email: ${user.email}`,
      });
    }

    res.status(200).json({ message: "User deleted successfully!" });
  },
);

// @desc Get user profile (via cookie)
// @route GET /api/users/profile
// @access Private
export const getUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      throw new Error("User not found!");
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  },
);

// @desc Logout user (clear cookies)
// @route POST /api/users/logout
// @access Public
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully!" });
});
