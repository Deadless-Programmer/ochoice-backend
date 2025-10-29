import express from 'express';
const router = express.Router();
import { register , login, refreshToken, logout, createUser, changePassword, resetPassword} from '../controllers/auth.controller';
import { authorizeRoles, verifyToken } from '../middleware/verifyToken';

console.log('✅ Auth routes file loaded');

router.post('/register', register);
router.post('/login', login)
router.get("/refresh-token", refreshToken); // client calls this to get new access token
router.post("/logout", logout);

router.post("/create-user", verifyToken, authorizeRoles("superAdmin", "admin"), createUser);

// Logged-in user password change
router.put("/change-password", verifyToken, changePassword);

// SuperAdmin reset another user's password
router.put("/reset-password", verifyToken, authorizeRoles("superAdmin"), resetPassword);


export default router;

