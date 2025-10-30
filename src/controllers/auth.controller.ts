import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { generateTokens } from "../utils/generateToken";
import bcrypt from "bcryptjs";
import { SignOptions } from "jsonwebtoken";

import { sendEmail } from "../utils/sendEmail";

// Register (public)
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "superAdmin" : "customer";

    const newUser = await User.create({ username, email, password, role });
    const token = generateTokens(newUser);

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, username, email, role },
      accessToken: token.accessToken,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create User (Admin / SuperAdmin only)

export const createUser = async (req: Request, res: Response) => {
  try {
    // console.log(req)
    const { username, email, password, role } = req.body;
    const requester = (req as any).user;

    // Validate role
    const validRoles = ["admin", "seller"];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Role-based permission
    if (requester.role === "admin" && role === "admin") {
      return res
        .status(403)
        .json({ message: "Admin cannot create another admin" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await User.create({ username, email, password, role });

    res.status(201).json({
      message: `${role} created successfully`,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid credentials : User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({
        message: "Invalid credentials : Please give a valid password",
      });

    const token = generateTokens(user);

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email, role: user.role },
      accessToken: token.accessToken,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      id: string;
      role: string;
      username: string;
    };

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newTokens = generateTokens(user);

    res.cookie("refreshToken", newTokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: newTokens.accessToken,
    });
  } catch (error: any) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Change Password (for logged-in user)
export const changePassword = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; // verified token থেকে পাওয়া user
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both old and new passwords are required" });
    }

    // DB থেকে user আনো (ensure latest data)
    const existingUser = await User.findById(user._id);
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    // পুরনো পাসওয়ার্ড মিলাও
    const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // নতুন পাসওয়ার্ড hash করে save করো
    existingUser.password = newPassword;
    await existingUser.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;
    const { userId, newPassword } = req.body;

    // শুধুমাত্র SuperAdmin পারবে
    if (requester.role !== "superAdmin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only SuperAdmin can reset passwords" });
    }

    if (!userId || !newPassword) {
      return res
        .status(400)
        .json({ message: "userId and newPassword are required" });
    }

    const userToReset = await User.findById(userId);
    if (!userToReset)
      return res.status(404).json({ message: "User not found" });

    userToReset.password = newPassword;
    await userToReset.save();

    console.log("Saved password:", userToReset.password);

    res
      .status(200)
      .json({ message: `Password reset successful for ${userToReset.email}` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });

    // Create Reset Token (short-lived)
    const payload = { id: user._id };
    const secret = process.env.JWT_RESET_PASSWORD_SECRET!;
    const options: SignOptions = {
      expiresIn: (process.env.JWT_RESET_PASSWORD_EXPIRES as any) || "15m",
    };

    const resetToken = jwt.sign(payload, secret, options);
    // Reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send Email
    const message = `
      <h3>Password Reset Request</h3>
      <p>Hi ${user.username},</p>
      <p>Click the link below to reset your password. Link is valid for 15 minutes.</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: message,
    });

    res
      .status(200)
      .json({ message: `Password reset email sent to ${user.email}` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPasswordViaToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword)
      return res.status(400).json({ message: "New password is required" });

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_RESET_PASSWORD_SECRET!
    ) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword; // pre-save middleware will hash it
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error: any) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};


// =======================
// 🧩 Update User Profile
// =======================
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // token থেকে আসবে
    const { username, email } = req.body;

    // validation
    if (!username && !email) {
      return res.status(400).json({ message: "Please provide data to update" });
    }

    // find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // update fields
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};









// Logout
export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
