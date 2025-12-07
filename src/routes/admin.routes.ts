import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/verifyToken";
import {
  getAllUsers,
  deleteUserByAdmin,
  restoreUserByAdmin,
  updateUserByAdmin,
//   getUserById,
} from "../controllers/admin.controller";
import User from "../models/user.model";

const router = express.Router();

// ✅ Get all users (Admin & SuperAdmin)
router.get(
  "/users",
  verifyToken,
  authorizeRoles("admin", "superAdmin"),
  getAllUsers
);

// ✅ Get a single user by ID
// router.get(
//   "/user/:id",
//   verifyToken,
//   authorizeRoles("admin", "superAdmin"),
//   getUserById
// );

// ✅ Update user (Admin & SuperAdmin)
router.put(
  "/user/:id",
  verifyToken,
  authorizeRoles("admin", "superAdmin"),
  updateUserByAdmin
);

// ✅ Soft delete user
router.delete(
  "/user/:id",
  verifyToken,
  authorizeRoles("admin", "superAdmin"),
  deleteUserByAdmin
);

// ✅ Restore soft-deleted user
router.put(
  "/user/:id/restore",
  verifyToken,
  authorizeRoles("admin", "superAdmin"),
  restoreUserByAdmin
);

export default router;



// add any property for an existing users who don't have it 
// router.get("/fix-users",  verifyToken,
//   authorizeRoles("admin", "superAdmin"),  async (req, res) => {
//   try {
//     const result = await User.updateMany(
//       { isDeleted: { $exists: false } },
//       { $set: { isDeleted: false } }
//     );
//     res.json({ message: "Users fixed", modifiedCount: result.modifiedCount });
//   } catch (err) {
//     res.status(500).json({ message: "Error fixing users" });
//   }
// });

