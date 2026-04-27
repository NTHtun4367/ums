import { NextFunction, Request, Response } from "express";
import { IUser, User, userRoles } from "../models/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import { ENV } from "../utils/env";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("Unauthorized. No token provided.");
    }

    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET!) as JwtPayload;

      const user = await User.findById(decoded.userId)
        .select("-password")
        .lean();

      if (!user) {
        res.status(401);
        throw new Error("User not found.");
      }

      req.user = user as unknown as IUser;
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Unauthorized. Invalid token.");
    }
  },
);

/**
 * Accepts a list of allowed roles (eg. "admin", "teacher")
 * usage => router.post("/", protect, authorize("admin"), controller)
 */

export const authorize = (roles: userRoles[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: `User role ${req.user?.role} is not authorized to access.`,
        });
    }
    next();
  };
};
