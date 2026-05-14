import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user";
import { AuthRequest } from "../middlewares/auth";
import { logActivity } from "../utils/activitieslog";
import { generateToken } from "../utils/generateToken";
import { Department } from "../models/department";

// @desc Register new user
// @route POST /api/users/register
// @access Private (Admin & Teacher only)
export const register = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    console.log("Hello");

    const { email, departmentId, role } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }

    if (!req.body.classId) delete req.body.classId;
    if (!req.body.departmentId) delete req.body.departmentId;

    if (role === "hod") {
      req.body.teacherStatus = "professor";
    }

    // 2. Create the new user
    // The role is handled by the frontend (switching to 'hod' if isHod is true)
    // or you can force it here: const role = isHod ? "hod" : req.body.role;
    const newUser = await User.create(req.body);

    console.log(role, departmentId);

    // 3. IF the user is an HOD, update the Department's headId
    if (role === "hod" && departmentId) {
      const department = await Department.findById(departmentId);
      if (department) {
        department.headId = newUser._id; // Assign the new user as the Head
        await department.save();
        console.log(department);

        // Optional: Log the department update
        await logActivity({
          userId: req.user?._id.toString()!,
          action: "Updated Department Head",
          details: `Assigned ${newUser.name} as HOD for department ${department.name}`,
        });
      }
    }

    // 4. Log User Creation
    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Register",
      details: `Created ${newUser.role}: ${newUser.email}`,
    });

    // 5. Return response
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: newUser.isActive,
      teacherStatus: newUser.teacherStatus,
      message: "User registered and Department Head updated successfully!",
    });
  },
);

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id.toString());
    // Return user without password
    const userResponse = await User.findById(user._id).select("-password");
    res.status(200).json(userResponse);
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// @desc Get all users (With Pagination & Filtering)
// @route GET /api/users
// @access Private (Admin only)
// controllers/userController.ts
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // 1. Extract classId from query
  const { role, search, departmentId, teacherStatus, classId } = req.query;

  const filters: any = {};

  if (role && role !== "all") filters.role = role;
  if (departmentId) filters.departmentId = departmentId;
  if (teacherStatus) filters.teacherStatus = teacherStatus;

  // 2. Apply classId filter if it exists
  if (classId) filters.classId = classId;

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [total, users] = await Promise.all([
    User.countDocuments(filters),
    User.find(filters)
      .select("-password")
      .populate("departmentId classId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
  ]);

  res.json({
    users,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      total,
      limit,
    },
  });
});

// @desc Get current logged-in user profile
// @route GET /api/users/me
// @access Private
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id)
    .select("-password")
    .populate("departmentId classId");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("departmentId classId");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
});

// @desc Update user (Admin)
// @route PATCH /api/users/update/:id
// @access Private (Admin only)
export const updateUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Update User",
      details: `Updated ${user.email}`,
    });
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      teacherStatus: user.teacherStatus, // Added teacherStatus to response
      message: "User updated successfully!",
    });
  },
);

// @desc Delete user (Admin)
// @route DELETE /api/users/delete/:id
// @access Private (Admin only)
export const deleteUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found!");
    }

    const email = user.email; // Store for log
    await user.deleteOne();

    await logActivity({
      userId: req.user?._id.toString()!,
      action: "Deleted User",
      details: `Deleted user: ${email}`,
    });

    res.status(200).json({ message: "User deleted successfully!" });
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
