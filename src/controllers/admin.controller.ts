import { Request, Response } from "express";
import User from "../models/user.model";

// ✅ Common Role Checker Function
const canManage = (requesterRole: string, targetRole: string): boolean => {
  // SuperAdmin can manage anyone except another SuperAdmin
  if (requesterRole === "superAdmin") {
    return targetRole !== "superAdmin";
  }
  // Admin can manage only sellers
  if (requesterRole === "admin") {
    return targetRole === "seller" || targetRole === "user";
  }
  // Others can’t manage anyone
  return false;
};

// ==============================
// 1️⃣ Get All Users
// ==============================
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;

    if (requester.role !== "admin" && requester.role !== "superAdmin") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    let query: any = {};

    if (requester.role === "admin") {
      // admin can’t see superAdmin & can’t see deleted users
      query = { role: { $ne: "superAdmin" }, isDeleted: false };
    } else if (requester.role === "superAdmin") {
      // superAdmin can see everyone (deleted + active)
      query = {}; // fetch all users, no filter
    }

    const users = await User.find(query).select("-password");
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



// ==============================
// 2️⃣ Update User by Admin/SuperAdmin
// ==============================
export const updateUserByAdmin = async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;
    const { id } = req.params;
    const { username, email, role } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Permission Check
    if (!canManage(requester.role, user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot modify this user" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role && canManage(requester.role, role)) user.role = role;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
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

// ==============================
// 3️⃣ Delete User by Admin/SuperAdmin
// ==============================
// Delete User (Soft Delete)
export const deleteUserByAdmin = async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Permission Check
    if (!canManage(requester.role, user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot delete this user" });
    }

    user.isDeleted = true;
    await user.save();

    res.status(200).json({
      message: `${user.role} (${user.username}) soft-deleted successfully`,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const restoreUserByAdmin = async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!canManage(requester.role, user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: You cannot restore this user" });
    }

    user.isDeleted = false;
    await user.save();

    res.status(200).json({
      message: `${user.role} (${user.username}) restored successfully`,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};




