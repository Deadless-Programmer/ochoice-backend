// types/express.d.ts
import "express";
import { IUser } from "src/models/user.model.js";



declare global {
  namespace Express {
    interface Request {
      user?: IUser | any; 
    }
  }
}


export {};