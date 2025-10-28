import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';


export const generateTokens = (user: IUser) => {
  // Access Token (short lived)
  const accessToken = jwt.sign(
    { id: user._id, role: user.role, urerName: user.username },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: '15m' } // 15 min
  );

  // Refresh Token (long lived)
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role, urerName: user.username },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' } // 7 days
  );

  return { accessToken, refreshToken };
};
