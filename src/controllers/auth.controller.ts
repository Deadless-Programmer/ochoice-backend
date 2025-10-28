import { Request, Response } from 'express';
// import User, { IUser } from '../models/User.js';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import { generateTokens } from '../utils/generateToken';

// JWT Token create


// Register (public)
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    // Determine role: if first user → superAdmin else customer
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'superAdmin' : 'customer';

    const newUser = await User.create({ username, email, password, role });

    const token = generateTokens(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser._id, username, email, role },
      token,
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
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateTokens(user);

    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, username: user.username, email, role: user.role },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
