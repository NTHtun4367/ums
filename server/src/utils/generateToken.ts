import { Response } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "./env";

export const generateToken = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, ENV.JWT_SECRET as string, {
    expiresIn: "7d",
    algorithm: "HS512",
  });

  // attach token to http-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
    path: "/", // cookie valid for entire site
  });
};
